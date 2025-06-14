const code = `
ALSReducer.java

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import org.apache.hadoop.io.*;
import org.apache.hadoop.mapreduce.Reducer;

public class ALSReducer extends Reducer<Text, Text, Text, Text> {
    
    private int k = 2; 
    private double lambda = 0.1; 
    
    @Override
    protected void setup(Context context) throws IOException, InterruptedException {
        k = context.getConfiguration().getInt("k", 2);
        lambda = context.getConfiguration().getDouble("lambda", 0.1);
    }
    
    @Override
    public void reduce(Text key, Iterable<Text> values, Context context) 
            throws IOException, InterruptedException {
        
        String[] keyParts = key.toString().split("_");
        String matrix = keyParts[0];
        String index = keyParts[1];
        
        Map<String, Double> observations = new HashMap<>();
        
        for (Text value : values) {
            String[] parts = value.toString().split(",");
            observations.put(parts[0], Double.parseDouble(parts[1]));
        }
        
        double[] factor = new double[k];
        for (int i = 0; i < k; i++) {
            factor[i] = Math.random();
        }
        
        for (int iter = 0; iter < 10; iter++) {
            for (int i = 0; i < k; i++) {
                double numerator = 0.0;
                double denominator = lambda;
                
                for (Map.Entry<String, Double> entry : observations.entrySet()) {
                    String otherIndex = entry.getKey().split("_")[1];
                    double otherFactor = 1.0; 
                    double residual = entry.getValue();
                    
                    for (int j = 0; j < k; j++) {
                        if (j != i) {
                            residual -= factor[j] * otherFactor;
                        }
                    }
                    
                    numerator += otherFactor * residual;
                    denominator += otherFactor * otherFactor;
                }
                
                if (denominator != 0) {
                    factor[i] = numerator / denominator;
                }
            }
        }
        
        // Emit the factor vector
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < k; i++) {
            if (i > 0) sb.append(",");
            sb.append(String.format("%.4f", factor[i]));
        }
        
        context.write(new Text(matrix + "," + index), new Text(sb.toString()));
    }
}


`
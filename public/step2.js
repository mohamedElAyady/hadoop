const code = `
ALSMapper.java

import java.io.IOException;
import org.apache.hadoop.io.*;
import org.apache.hadoop.mapreduce.Mapper;

public class ALSMapper extends Mapper<LongWritable, Text, Text, Text> {
    
    private int k = 2; 
    
    @Override
    protected void setup(Context context) throws IOException, InterruptedException {
        k = context.getConfiguration().getInt("k", 2);
    }
    
    @Override
    public void map(LongWritable key, Text value, Context context) 
            throws IOException, InterruptedException {
        
        String[] parts = value.toString().split(",");
        if (parts.length != 3) return;
        
        String row = parts[0];
        String col = parts[1];
        double val = Double.parseDouble(parts[2]);
        
        context.write(new Text("U_" + row), new Text("X_" + col + "," + val));
        
        context.write(new Text("V_" + col), new Text("X_" + row + "," + val));
    }
}

`
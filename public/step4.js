const code = `
ALSDriver.java


import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

public class ALSDriver {
    
    public static void main(String[] args) throws Exception {
        if (args.length != 3) {
            System.err.println("Usage: ALSDriver <input path> <output path> <rank k>");
            System.exit(-1);
        }
        
        Configuration conf = new Configuration();
        conf.setInt("k", Integer.parseInt(args[2]));
        conf.setDouble("lambda", 0.1);
        
        Job job = Job.getInstance(conf, "Matrix Factorization ALS");
        job.setJarByClass(ALSDriver.class);
        job.setMapperClass(ALSMapper.class);
        job.setReducerClass(ALSReducer.class);
        
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(Text.class);
        
        FileInputFormat.addInputPath(job, new Path(args[0]));
        FileOutputFormat.setOutputPath(job, new Path(args[1]));
        
        System.exit(job.waitForCompletion(true) ? 0 : 1);
    }
}

`
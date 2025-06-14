// Set content type header
const code = `GenerateMatrix.java
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Random;

public class GenerateMatrix {
    public static void main(String[] args) throws IOException {
        BufferedWriter writer = new BufferedWriter(new FileWriter("X.txt"));
        Random rand = new Random();
        int size = 10;

        for (int i = 0; i < size; i++) {
            for (int j = 0; j < size; j++) {
                int val = rand.nextInt(11);
                writer.write(i + "," + j + "," + val + "\\n");
            }
        }

        writer.close();
        System.out.println("Matrix X.txt generated");
    }
}

// Commands:
javac GenerateMatrix.java
java GenerateMatrix`;
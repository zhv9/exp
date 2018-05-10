package ch1;
import java.util.Scanner;

public class Ex1 {
    public static void main(String[] args) {
        System.out.println("hello world");
        Scanner scanner = new Scanner(System.in);

        int i = scanner.nextInt();
        String binary = Integer.toString(i, 2);

        System.out.printf("2:%s\n", binary);
        System.out.printf("8:%o\n", i);
        System.out.printf("16:%x\n", i);
        System.out.printf("d:%.5f\n", 1.0 / i);
        System.out.printf("double:%d\n", i);

        scanner.close();
    }
}
package ch1;

import java.util.Scanner;

public class Ex2 {
    public static void main(String[] args) {
        System.out.println("请输入数字");
        Scanner scanner = new Scanner(System.in);
        int i = scanner.nextInt();

        int deg = i % 360;

        System.out.printf("degree is: %d\n", deg);

        int deg2 = Math.floorMod(i, 360);
        System.out.printf("degree2 is: %d\n", deg2);
        scanner.close();
    }
}

package ch1;

import java.awt.*;
import java.util.Scanner;

public class Ex3 {
    public static void main(String[] args) {
        System.out.println("请输入3个数字");
        Scanner scanner = new Scanner(System.in);

        int i1, i2, i3;

        i1 = scanner.nextInt();
        i2 = scanner.nextInt();
        i3 = scanner.nextInt();

        int temp;
        if (i1 > i2) {
            i2 = i1;
        }
        if (i2 >= i3) {
            i3 = i2;
        }
        System.out.println(i3);
    }
}

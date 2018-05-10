package ch1;

import java.util.Scanner;

public class Ex8 {
    public static void main(String[] args){
        System.out.println("请输入一个带空格的字符串");
        Scanner scanner = new Scanner(System.in);
        String s = scanner.nextLine();

        String[] s1 = s.split(" ");

        for (String str:
             s1) {
            System.out.println(str);
        }
    }
}

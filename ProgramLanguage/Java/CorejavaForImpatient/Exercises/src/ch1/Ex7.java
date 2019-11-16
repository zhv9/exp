package ch1;

import java.util.Scanner;

public class Ex7 {
    public static void main(String[] args){
        System.out.println("请输2个数值");
        Scanner scanner = new Scanner(System.in);

        short i1 = scanner.nextShort();
        short i2 = scanner.nextShort();

        System.out.println(Short.toUnsignedInt(i1)+Short.toUnsignedInt(i2));
        System.out.println(Short.toUnsignedInt(i1)-Short.toUnsignedInt(i2));
        System.out.println(Short.toUnsignedInt(i1)*Short.toUnsignedInt(i2));
        System.out.println(Short.toUnsignedInt(i1)/Short.toUnsignedInt(i2));
        System.out.println(Short.toUnsignedInt(i1)%Short.toUnsignedInt(i2));
    }
}

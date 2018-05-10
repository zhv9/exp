package ch1;

import java.util.Random;

public class Ex10 {
    public static void main(String[] args) {
        long data = new Random().nextLong();

        //data = data % 36;

        String str = Long.toString(data, 36);

        System.out.printf(str);

    }
}

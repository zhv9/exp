package ch1;

import java.util.Scanner;

public class Ex11 {
    public static void main(String[] args) {
        String str = "abcd 中文 αβδεζη 12zxv";

        int[] codepoints = str.codePoints().toArray();

        for (int codepoint :
                codepoints) {
            if (codepoint > 127) {
                System.out.printf("The character that is not ASCII is '%c'. Unicode code is %04X。%n",
                        codepoint, codepoint);
            }
        }
    }
}

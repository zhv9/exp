package ch1;

import java.math.BigInteger;
import java.util.function.BinaryOperator;

public class Ex6 {
    public static void main(String[] args) {
        BigInteger result = BigInteger.valueOf(1);
        for (int i = 1000; i > 1; i--) {
            result = result.multiply(BigInteger.valueOf(i));
        }

        System.out.println(result);
    }
}

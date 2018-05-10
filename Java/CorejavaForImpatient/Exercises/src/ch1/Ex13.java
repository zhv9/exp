package ch1;

import sun.plugin.javascript.navig.Array;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

public class Ex13 {
    public static void main(String[] args) {
        int[] lotteryNums = new int[6];
        List<Integer> seed = new ArrayList<Integer>();
        for (int i = 1; i < 50; i++) {
            seed.add(i);
        }

        Random random = new Random();

        for (int i = 0; i < 6; i++) {
            int randomNum = random.nextInt(49 - i);
            lotteryNums[i] = seed.get(randomNum);
            seed.remove(randomNum);
        }

        Arrays.sort(lotteryNums);

        System.out.printf("The lottery numbers are:%s.%n", Arrays.toString(lotteryNums));
    }
}

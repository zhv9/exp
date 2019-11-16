package ch1;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Ex14 {
    public static void main(String[] args) {
        System.out.println("Please input numbers separate by space.");
        List<String> readLines = new ArrayList<>();

        String line;
        while (!"".equals(line = GetData().trim())) {
            readLines.add(line);
        }

        int[][] square = new int[readLines.size()][readLines.size()];
        for (int i = 0; i < readLines.size(); i++) {
            List<Integer> splitNumber = SplitData(readLines.get(i));
            for (int j = 0; j < splitNumber.size(); j++) {
                square[i][j] = splitNumber.get(j);
            }
        }

        boolean result = CheckMagicSquare(square);

        System.out.printf("This square is %b%n", result);
    }

    private static String GetData() {
        Scanner scanner = new Scanner(System.in);
        return scanner.nextLine();
    }

    private static List<Integer> SplitData(String str) {
        String[] strArr = str.split(" ");
        ArrayList<Integer> lineNumber = new ArrayList<Integer>();
        for (int i = 0; i < strArr.length; i++) {
            lineNumber.add(ParseInt(strArr[i]));
        }
        return lineNumber;

    }

    private static Integer ParseInt(String str) {
        Integer i;
        try {
            i = Integer.parseInt(str);
        } catch (Exception e) {
            i = 0;
        }
        return i;
    }

    private static boolean CheckMagicSquare(int[][] square) {
        int lastSum = 0;
        boolean result = true;
        for (int col = 0; col < square[0].length; col++) {
            lastSum = lastSum + square[0][col];
        }
        result = CheckColumn(square, lastSum) &&
                CheckRow(square, lastSum) &&
                Checkdiagonal(square, lastSum);

        return result;
    }

    private static boolean CheckColumn(int[][] square, int lastSum) {
        int currentSum;
        boolean result = true;
        for (int col = 0; col < square[0].length; col++) {
            currentSum = 0;
            for (int row = 0; row < square.length; row++) {
                currentSum = currentSum + square[row][col];
            }
            if (currentSum != lastSum) {
                result = false;
                break;
            }
        }
        return result;
    }

    private static boolean CheckRow(int[][] square, int lastSum) {
        int currentSum;
        boolean result = true;
        for (int row = 0; row < square.length; row++) {
            currentSum = 0;
            for (int col = 0; col < square[row].length; col++) {
                currentSum = currentSum + square[row][col];
            }
            if ((currentSum != lastSum)) {
                result = false;
                break;
            }
        }
        return result;
    }

    private static boolean Checkdiagonal(int[][] square, int lastSum) {
        int currentSum1 = 0;
        int currentSum2 = 0;
        boolean result = true;

        int length = square[0].length;
        for (int index = 0; index < length; index++) {
            currentSum1 = currentSum1 + square[index][index];
            currentSum2 = currentSum2 + square[index][length - index - 1];
        }
        if ((currentSum1 != lastSum || currentSum2 != lastSum)) {
            result = false;
        }
        return result;
    }
}

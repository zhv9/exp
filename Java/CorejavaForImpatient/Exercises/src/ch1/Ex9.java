package ch1;

public class Ex9 {
    public static void main(String[] args) {
        String s = "It's a test";
        String t1 = "It's a" + " test";
        String t2 = new String("It's a test");
        String t3 = "It's a placeholder".replace("placeholder", "test");
        String t4 = new StringBuilder("It's a test").toString();

        System.out.printf("分开的         s==t:%b, t.equal(s):%b.%n", s == t1, s.equals(t1));
        System.out.printf("new string的   s==t:%b, t.equal(s):%b.%n", s == t2, s.equals(t2));
        System.out.printf("replace的      s==t:%b, t.equal(s):%b.%n", s == t3, s.equals(t3));
        System.out.printf("StringBuilder的s==t:%b, t.equal(s):%b.%n", s == t4, s.equals(t4));
    }
}

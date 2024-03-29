---
marp: true
paginate: true
---

# 程序员工作法-任务分解

**基于《10x程序员工作法》的笔记**

---

<style scoped>
section {
    font-size: 18px;
}
</style>

- [程序员工作法-任务分解](#程序员工作法-任务分解)
    - [为什么和什么是任务分解](#为什么和什么是任务分解)
    - [测试](#测试)
        - [谁做测试](#谁做测试)
        - [测试模型](#测试模型)
        - [测试金字塔的实践](#测试金字塔的实践)
    - [写测试的阶段](#写测试的阶段)
    - [大师的工作秘籍](#大师的工作秘籍)
        - [极限编程](#极限编程)
        - [大师（Kent Beck）的工作方法](#大师kent-beck的工作方法)
        - [任务分解](#任务分解)
            - [如果对任务对应的技术不熟悉，无法分解](#如果对任务对应的技术不熟悉无法分解)
    - [任务分解实践](#任务分解实践)
    - [如何把测试写好](#如何把测试写好)
    - [需求分解](#需求分解)
        - [用户故事的衡量标准](#用户故事的衡量标准)
        - [需求估算](#需求估算)
    - [需求管理](#需求管理)
        - [需求优先级](#需求优先级)
    - [面对不确定的产品功能](#面对不确定的产品功能)
        - [最小（代价）](#最小代价)
        - [可行（路径）](#可行路径)

---

## 为什么和什么是任务分解

**如今软件行业都在提倡拥抱变化，而任务分解是我们拥抱变化的前提。**

**动手做一个工作之前，请先对它进行任务分解。**

- 通过将宏大目标进行任务分解，才能将一个看似不着边际的目标向前推进。
- 一个大问题，我们都很难给出答案，但回答小问题却是我们擅长的。
- 任务的分解难点是给出一个可执行的分解
- 每个人的任务分解结果是不一样的，有些人经验不丰富，那就比经验丰富的人多了学习的任务。
- 如果没有做过任务分解的练习，那分解出来的大部分任务，粒度都会偏大。
- 推演的过程就是一个任务分解的过程。
- 分解的目标是让任务**可执行**，只要清楚的知道接下来的工作该怎么做，任务分解就可以告一段落了。

---

## 测试

**多写单元测试**

---

### 谁做测试

- 测试应该是程序员工作的一部分
- 测试人员只能在系统外部做功能特性的测试。而软件是由很多内部模块组成的，测试人员只能从外部保障正确性，所能达到的效果是有限的。
- 需求人员要确定验收标准，开发人员则要交出自己的开发者测试。这是一个来自于精益原则的重要思想：内建质量（Build Quality In）。

**所以，对于每个程序员来说，只有在开发阶段把代码和测试都写好，才有资格说，自己交付的是高质量的代码。**

---

### 测试模型

- 测试模型
    - 蛋卷模型：下小上大
    - 金字塔模型：下大上小
- 越是底层的测试，牵扯到相关内容越少，而高层测试则涉及面更广。
- 越是高层测试，越容易被底层模块的变化影响，所以也就越脆弱。同时高层测试会牵扯到外部系统，这样复杂度有进一步提升。
- 人们都喜欢做简单的事情
    - 所以比较复杂的高层测试就会比较少，覆盖率就很难上去。而且因为涉及的方面比较多，定位也就很困难。
    - 反过来如果将测试放到底层，因为牵扯的内容少，也就更容易写，覆盖率也就会更多。出现问题也更容易发现。

测试金字塔的实践就是：多写单元测试。

---

### 测试金字塔的实践

测试金字塔的重要实践基础，就是持续集成。由于测试数量到一定规模后，测试运行的时间就会很长，所以就需要将测试分为在本地运行的单元测试和在服务器运行的系统测试。

作为提交代码的防护网，测试数量多寡决定着得到反馈的早晚。所以，金字塔模型与持续集成天然就有着很好的配合。

---

<style scoped>
section {
    font-size: 26px;
}
</style>

## 写测试的阶段

**我们应该编写可测的代码。**

- 先写测试后写代码的实践指的是测试先行开发，而非测试驱动开发
- TDD 的节奏：“红 - 绿 - 重构”
- 测试先行开发和测试驱动开发的差异就在重构上。
    - 代码通过测试并不是终点，而在重构后消除了代码中的坏味道才是测试驱动开发的重点。
    - 在有了测试，就可以大胆的进行重构，由修改带来的错误都会被测试代码捕获到。
    - 因为重构和测试的互相配合，它会驱动着你把代码写得越来越好。这是对“驱动”一词最粗浅的理解。
- 要考虑代码的可测试性
    - 有时候 TDD 也会被称为“测试驱动设计”，因为先写测试后写代码会让看待代码的角度发生变化，甚至需要调整设计后，才能更好的测试。

---

## 大师的工作秘籍

**将任务拆小，越小越好**

---

### 极限编程

- 如果集成好，那它的极限就是持续集成。
- 如果测试好，那就尽早测试，极限就是先写测试再根据测试调整代码。
- 如果代码评审好，那它的极限就是随时随地地代码评审，也就是结对编程。
- 如果客户交流好，那就多和客户交流，极限就是客户与开发时时刻刻在一起，也就是现场客户。

---

### 大师（Kent Beck）的工作方法

- 每当遇到一件要做的事，Kent Beck 总会先把它分解成几个小任务，记在一个清单上。然后才动手写测试、写代码、重构这样一个小循环。等一个循环完成了，他会划掉已经做完的任务，开始下一个。
- 一旦在解决问题的过程中遇到任何新的问题，他会把这个要解决的问题记录在清单上，保证问题不会丢失，然后，继续回到自己正在处理的任务上。
- 当他把一个个任务完成的时候，问题就解决完了。

**Kent Beck 的做法清晰而有节奏，每个任务完成之后，代码都是可以提交的。**

> 而大多数程序员之所以开发效率低，很多时候是没想清楚就动手了。因为没有想清楚，任务也就没有办法分解到很小。

---

### 任务分解

- 很多人看了一些 TDD 的练习觉得很简单，但自己动起手来却不知道如何下手。中间就是缺了任务分解的环节。
- 任务分解的关键在于：小。
    - 任务足够小，我们就可以在任务完成后选择进入下一个任务或者停下来。这样即便被打扰，也不会影响太多。
- 一个经过分解后的任务，需要关注的内容是有限的，我们就可以针对着这个任务，把方方面面的细节想得更加清晰。
- 在遇到任何问题时，都可以考虑它可以怎么一步一步地完成，确定好分解之后，解决问题就是一步一步地做了。
- 如果不能很好的分解，那说明还没想清楚，需要更多信息或更好的解决方案。

---

#### 如果对任务对应的技术不熟悉，无法分解

- 可以做一次技术 spike。把对应技术进行一次快速的试探，是否可以使用和解决当前的问题。
    - 通过各种渠道对技术进行一些了解
    - 通过了解的内容将 spike 任务进行分解。
    - 另外，在做 spike 的时候要确定这项技术在项目中应用场景和我们的关注点。如果希望通过新技术提高性能，那就把关注点放到性能上。
- Spike 的作用就在于消除不确定性，让项目经理知道这里要用到一项全团队没有人懂的技术，需要花时间弄清楚。

---

## 任务分解实践

**按照完整实现一个需求的顺序去安排分解出来的任务。**

- 很多人可能更习惯一个类一个类的写。但最好按照一个需求、一个需求的过程走，这样，任务是可以随时停下来的。
- 检验每个任务项是否拆分到位，就是看你是否知道它应该怎么做了
- 每做完一个任务，代码都是可以提交的。
- 按照完整实现一个需求的顺序去安排分解出来的任务。

---

<style scoped>
section {
    font-size: 20px;
}
</style>

## 如何把测试写好

**要想写好测试，就要写简单的测试。**

- 什么时候测试不够好：主要是因为这些测试不够简单。只有将复杂的测试拆分成简单的测试，测试才有可能做好。
- 既然无法用写程序的方式保证测试的正确性，我们只有一个办法：**把测试写简单，简单到一目了然，不需要证明它的正确性。**
- 一般测试需要分为四段：**前置准备、执行、断言和清理**
- 测试的坏味道
    - 测试的执行部分应该只有一行代码调用，不应该做太多事情。如果要测试很多事情，就分解为多个测试。
    - 测试一定要有断言。测试不好写，往往是设计的问题，应该调整的是设计，而不是在测试这里做妥协。
    - 测试里不应该有判断语句
- A-TRIP
    - Automatic，自动化：测试尽可能交给机器执行
    - Thorough，全面的：应该尽可能用测试覆盖各种场景
    - Repeatable，可重复的：某一个测试反复运行，结果应该是一样的
    - Independent，独立的：测试和测试之间不应该有任何依赖
    - Professional，专业的：测试代码，也是代码，也要按照代码的标准去维护。

---

## 需求分解

**想要管理好需求，先把需求拆小。**

绝大多数问题都是由于分解的粒度太大造成的，少有因为粒度太小而出问题的。所以，需求分解的一个原则是，粒度越小越好。

---

### 用户故事的衡量标准

评价用户故事有一个“INVEST 原则”，这是六个单词的缩写，分别是：

- Independent，独立的：一个用户故事应该完成一个独立的功能，尽可能不依赖于其它用户故事
- Negotiable，可协商的：有事大家商量是一起工作的前提，我们无法保证所有的细节都能 100% 落实到用户故事里
- Valuable，有价值的：一个用户故事都应该有其自身价值
- Estimatable，可估算的：不能估算的用户故事，要么是因为有很多不确定的因素，要么是因为需求还是太大
- Small，小：步子大了，容易...。小的用户故事才方便调度，才好安排工作。
- Testable，可测试的：不能测试谁知道你做得对不对

---

<style scoped>
section {
    font-size: 26px;
}
</style>

### 需求估算

我们从分解出来的用户故事挑出一个最简单的，比如，某个信息的查询。这个最简单的用户故事，其作用就是当作基准。比如，我们采用费波纳契数列，那这个最简单的用户故事就是基准点 1。其他的用户故事要与它一一比较，如果一个用户故事比它复杂，那可以按照复杂程度给个估计。

- 估算时，在脑中将故事进行一下任务分解，想想有哪些步骤要完成，然后才好做对比。（任务分解是基础中的基础，不学会分解，工作就只能依赖于感觉，估算就不靠谱）
- 估算的结果是相对的，不是绝对精确的，我们不必像做科研一样，只要给出一个相对估算就好。
- 不同的人估算出的结果可能会有差别，如果团队规模不大，可以全员参与。
    - 估算结果差异较大时，把脑中的任务分解拿出来看看差异在哪。
    - 通常是双方对需求理解有偏差。
    - 一般来说，估算的过程也是大家加深对需求理解的过程。
- 估算的另一重要作用就是发现特别大的用户故事

---

## 需求管理

**尽量做最重要的事。**

就凭一句“老板说的”，我们就可以判断出，产品经理缺乏对需求管理应有的理解。

需求很多，但时间有限，所以我们只好把产品的“一部分”开发好，送上线。但到底选择“哪部分”优先上线呢？这就是需求管理，也就是优先级的问题。

---

<style scoped>
section {
    font-size: 22px;
}
</style>

### 需求优先级

“来自老板”，这是判断优先级最简单的答案，也是**推卸责任的一个答案**。

- **为什么要区分优先级**？因为时间是有限的，有限的时间内你能完成工作的上限是一定的。
- 谈到**时间管理**，一个有效的时间管理策略是**艾森豪威尔矩阵**（Eisenhower Matrix），它将事情按照重要和紧急两个维度进行划分，也就形成了四个部分：重要且紧急，重要不紧急，不重要且紧急，不重要不紧急。
    - 重要且紧急的事情：要立即做。
    - 重要但不紧急的事情：应该是我们重点投入精力的地方。
    - 紧急但不重要的事情：可以委托别人做。
    - 不重要不紧急的事情：尽量少做。
    - **如果不把精力放在重要的事情上，到最后可能都变成紧急的事情。**
- **对于无法排优先级的**：我们应该多问一些问题。默认所有需求都不做，直到弄清楚为什么要做这件事。
- **不同角色真正的差异是工作上下文的不同**。每个人都在自己的上下文里工作，上下文也就局限了很多人的视野。
    - 两个产品经理都说他的重要，这时就要更高一级的老板来判断了。
    - 老板比你们的上下文大，因为他有看待这个问题更多的维度。**当员工想不明白的事，换成老板的视角就全明白了。**

---

## 面对不确定的产品功能

**做好产品开发，最可行的方式是采用 MVP（最小可行产品）。**就是要用最小的代价找到一条可行的路径。

什么叫最小可行产品？就是“刚刚好”满足客户需求的产品。客户需求好理解，怎么算“刚刚好”呢？其中的关键在于理解“最小”和“可行”。

---

<style scoped>
section {
    font-size: 24px;
}
</style>

### 最小（代价）

- 最小的代价：就是能不做的事情就不做，能简化的事情就简化。
- 我们要做的是验证一个想法的可行性，甚至不是为了开发一个软件，开发软件只是一种验证手段。
- 我们开发软件的目的是为了解决问题，如果不写软件就把问题解决了，岂不是更好。

1. 做了一个产品文档，就好像我们已经有了这个产品一样，让负责销售的同事拿着这个文档给客户讲讲，看看客户对这个想法的反映。
2. 客户如果有兴趣就会有各种各样的想法和要求。甚至是可接受的价格区间。
3. 验证方向上的想法后，就可以进入具体产品设计阶段。此时可以做一个带有交互的产品原型给客户看。
4. 客户会提出各种各样的细节问题，在团队拿到反馈后，再给客户确认。来回多次后，就是真实的客户期望的产品功能了。
5. 直到这个时候团队才真正进到开发阶段。这时团队验证了一大堆的想法，而代码却是一行都没有写，所有花费的工作量都是有针对性的验证。

---

### 可行（路径）

- 从产品可行的角度，我们需要转换一下思路，**不是一个模块做得有多完整，而一条用户路径是否通畅。**
- 当时间有限时，我们需要学会找到一条可行的路径，在完整用户体验和完整系统之间，找到一个平衡。

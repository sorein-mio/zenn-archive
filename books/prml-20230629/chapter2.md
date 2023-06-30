---
title: "第２章: 確率分布"
---
# 第２章: 確率分布

様々な確率分布とそれらの特徴について説明する

- 観測値の有限集合 $\bm{x}_1, ..., \bm{x}_N$ が与えられた時、確率変数$\mathbf{x}$の確率分布$p(\bm{x})$をモデル化する、すなわち**密度推定**(density estimation)をすることに用いられる
- 事前分布の関数の形が事後分布の形と同じになる事前分布のことを**共役事前分布**(conjugate prior)と呼ぶ
- ガウス分布のような一部のパラメータによって形状が決定されるような分布のことを**パラメトリック**(parametric)であるという
    - しかし、パラメータによって形状が決まるというのは制限でありデメリットでもある
    - このような時は、**ノンパラメトリック**(nonparametric)な密度推定が有効である

## 2.1: 二値変数

コイン投げのような二値確率変数$x = \{0, 1\}$の場合を考える

- これは**ベルヌーイ分布**(Bernoulli distribution)

    $$
    \text{Bern}(x|\mu) = \mu^x(1-\mu)^{1-x}
    $$

- この分布に対して最尤推定を行うと平均値は

    $$
    \mu_{ML} = \frac{1}{N}\sum_{n=1}^Nx_n
    $$

    - 尤度関数は個々の$x_n$には依存せず、$\sum_{n=1}^Nx_n$ にのみ依存する
        - このような和のことを**十分統計量**(sufficient statistic)という
    - 🧐 しかし、これは３回中３回とも偶然に表が出たデータを用いた場合、予測ではこのコインは生涯表が出るという明らかに破綻した予測になる
- $N$個のデータ集合の内、$x=1$となる観測値の数が$m$となる分布を考える
    - これは**二項分布**(binomial distribution)

        $$
        \text{Bin}(m|N, \mu) = \dbinom{N}{m}\mu^m(1-\mu)^{N-m}
        $$


### 2.1.1: ベータ分布

上記で説明したベルヌーイ分布及び二項分布のパラメータ$\mu$をベイズ主義的に推定する

- 初めに、事前分布$p(\mu)$を与える必要がある
    - 尤度関数が$\mu^x(1-\mu)^{1-x}$の形の因数の積になっていることに着目する
        - 事前分布が$\mu$及び$1-\mu$の冪乗に比例するように選ぶなら、事後分布は事前分布と同じ関数形式になる→**共役性**(conjugacy)
    - ベルヌーイ分布及び二項分布の事前分布として**ベータ分布**(beta distribution)を採用する

        $$
        \text{Beta}(\mu|a, b) = \frac{\Gamma(a+b)}{\Gamma(a)\Gamma(b)}\mu^{a-1}(1-\mu)^{b-1}
        $$

        - $\Gamma(x):$  **ガンマ関数**(gamma function)
        - $a, b:$  ハイパーパラメータ
    - 事後分布は尤度関数と事前分布の積に比例するので

        $$
        p(\mu|m, l, a, b)\propto\mu^{m+a-1}(1-\mu)^{l+b-1}
        $$

        とかける

        - $l=N-m$
        - $a$を１増やす事と$m$を１増やすことは等価値
            - $x=0$の場合も同様
            - 事前分布の$a, b$はそれぞれ$x=1, x=0$の**有効観測数**(effective number of observations)となっている
            - **逐次学習**(sequential learning)も可能
                - 元々存在するデータを加味した数値を$a, b$に適用すれば良い
- ベイズ学習を頻度主義者の立場で考える
    - すなわち、観測データの平均で分布を近似できるという特性
        - 🧐 無限の観測データがあればモデルを完全に復元できるというイメージ

        $$
        \mathbb{E}_\theta[\theta] = \mathbb{E}_{\mathcal{D}}[\mathbb{E}_\theta[\theta|\mathcal{D}]]
        $$

        - 事後平均をデータを生成する分布上で平均すると、事前分布に等しくなることを示している
            - 🧐 尤度推定はデータを生成する分布のうち１部を分布全体と仮定して計算を行っているからデータが少ない時に過学習を起こす？
            - 無限回の観測 $(m\rightarrow\infin, l\rightarrow\infin)$ を行えば、それは分布が得られたことと同値であるため上記の式が完全に成立する

## 2.2: 多値変数

相互に排他的な$K$個の可能な状態のうち一つを取るような離散変数を取り扱いたい

- 有名な例の一つとして1-of-$K$符号化法が挙げられる
    - 観測値を$\mathbf{x}=(0, 0, 1, 0, 0, 0)^\top$で表現する方法
    - $\mathbf{x}$ の分布は$\mathbf{x}_k = 1$となる確率を$\mu_k$とすると

        $$
        p(\mathbf{x}|\boldsymbol\mu) = \prod_{k=1}^K\mu_k^{x_k}
        $$

        で与えられる

        - 🧐 $x_k$以外0であるため、自動的に$\mu_k$が得られる式となっている
    - この式の尤度関数を解いて得られる最尤推定解は以下のようになっている
        - 解く際にはラグランジュ乗数を活用する

            $$
            \mu_k^{ML} = \frac{\sum_nx_{nk}}{N}\Bigl( = \frac{m_k}{N} \Bigr)
            $$

            - $x_{nk}:$  $n$個目の観測データ内の$k$番目のデータ
            - 尤度関数は個々の$x_{nk}$を考慮する必要なく、和だけ考えれば良い
                - この分布は**十分統計量(**sufficient statistic)
    - パラメータ$\boldsymbol \mu$と観測数$N$が与えられた条件下で、以下のような同時分布を考える

        $$
        \text{Mult}(m_1, ..., m_K|\boldsymbol \mu, N) = \dbinom{N}{m_1m_2...m_K}\prod_{k=1}^K\mu_k^{m_k}
        $$

        - **多項分布**(multinomial distribution)として知られている

### 2.2.1: ディリクレ分布

ベイズ主観的な推定を多項分布に対しても行いたいので、事前分布を与える

- この時、ベータ分布と同じように共役性を考慮する

    $$
    p(\boldsymbol \mu|\boldsymbol\alpha) \propto \prod_{k=1}^K \mu_k^{\alpha_k-1}
    $$

    - この時、$\{\mu_k\}$は総和の制約から$K-1$次元の**単体**(simplex)上に制限されて分布する
        - 🧐 ちょっと意味わからん
    - 正規化すると、以下のようになる

        $$
        \text{Dir}(\boldsymbol \mu|\boldsymbol\alpha) = \frac{\Gamma(\sum_{k=1}^K\alpha_k)}{\Gamma(\alpha_1)...\Gamma(\alpha_K)} \prod_{k=1}^K \mu_k^{\alpha_k-1}
        $$

        - これを**ディリクレ分布**(Dirichlet distribution)と呼ぶ

## 2.3: ガウス分布

様々な場面で現れ、利用価値も様々な**ガウス分布**(Gaussian distribution)を紹介

- エントロピーを最大化する分布はガウス分布(☞[1.6節](https://www.notion.so/PRML-a508bc1b861a4562bc8a13f42dbe473e?pvs=21))
- 確率変数の和を考える時も現れる
    - ラプラスによる**中心極限定理**(central limit theorem)によれば、ある緩やかな条件の下で足し合わされる変数の数が増えるに従って、徐々にガウス分布に従うようになる
- ガウス分布の幾何的な形状
    - 指数部分に現れる二次形式

        $$
        \Delta^2 = (\mathbf{x}-\boldsymbol\mu)^\top\Sigma^{-1}(\mathbf{x}-\boldsymbol\mu)
        $$

        は**マハラノビス距離**(Mahalanobis distance)と呼ばれる

        - これは、相関を考慮した距離計算が可能になる
        - $\Sigma$が単位行列の場合はユークリッド距離に一致する
        - 固有値計算を行うと、二次形式は以下のように書き換えることができる

            $$
            \Delta^2 = \sum_{i=1}^D\frac{y_i^2}{\lambda_i}
            $$

            - $y_i = \mathbf{u}_i^\top(\mathbf{x}-\boldsymbol\mu):$  すなわち、元の座標系を並行移動し回転した正規直交ベクトルにて定義された新しい座標系と捉えることができる
    - $y_i$で定義された新しい座標系でのガウス分布の形を考える
        - **ヤコビ行列** $\mathbf{J}$ (Jacobian matrix)を活用する
        - これによって多変量ガウス分布は$D$個の独立な１変数ガウス分布の積で表すことができる

            $$
            p(\mathbf{y}) = p(\mathbf{x})|\mathbf{J}| = \prod_{j=1}^D\frac{1}{(2\pi \lambda_j)^{1/2}}\exp \Bigl\{-\frac{y_j^2}{2\lambda_j}\Bigr\}
            $$

            - 同時確率分布を独立な分布の積に分解できるように固有ベクトルによって平行移動や回転をした
- ガウス分布のモーメントを考える
    - １次のモーメント
        - $\mathbf{z} = \mathbf{x} - \boldsymbol \mu$ とおいて考える
        - 指数部分の偶関数性を活用する

            $$
            \mathbb{E}[\mathbf{x}] = \boldsymbol\mu
            $$

    - ２次のモーメント
        - 単一変数の場合では、$\mathbb{E}[x^2]$を考えたが、多変量の場合は$\mathbb{E}[x_ix_j]$で与えられる$D^2$個の２次モーメントを考える必要がある
            - 但し、$\mathbb{E}[\mathbf{x}\mathbf{x}^\top]$の形でまとめて考えることが可能
        - $\mathbf{z} = \mathbf{x} - \boldsymbol \mu$ とおいて考える
        - １次の時と同様に、指数部分の偶関数性を利用する$(\mathbf{z}\boldsymbol\mu^\top, \boldsymbol\mu\mathbf{z}^\top)$
        - また、固有ベクトル展開を活用する $(\mathbf{z} = \sum_{j=1}^Dy_j\mathbf{u}_j)$

        $$
        \mathbb{E}[\mathbf{x}\mathbf{x}^\top] = \boldsymbol \mu \boldsymbol \mu ^\top + \Sigma
        $$

    - 確率変数の**共分散**(covariance)も定義する

        $$
        \begin{align*}
        \text{cov}[\mathbf{x}] &= \mathbb{E}[(\mathbf{x} - \mathbb{E}[\mathbf{x}])(\mathbf{x} - \mathbb{E}[\mathbf{x}])^\top] \\
        &= \Sigma
        \end{align*}
        $$

- ガウス分布は密度モデルとして広く利用されるものの重大な制限がある
    - パラメータの総数が$D$に対して２乗の割合で増加し、大規模な行列を計算することが困難になりうる
        - 対処法の一つは共分散行列に制限を加える
            - 対角: $\Sigma = \text{diag}(\sigma_i^2)$
            - 単位行列に比例: $\Sigma = \sigma^2\mathbf{I}$
                - しかし、形式を大きく制限したためにデータ中の興味深い相関を捉える能力を制限してしますという問題もある
    - ガウス分布は本質的に**単峰形**(極大値が１つ)という制限がある
        - 上記の問題点に対処するために**潜在変数**(latent variable)(**隠れ変数**(hidden variable)や**非観測変数**(unobserved variable)ともいう)を導入する(☞[2.3.9節](https://www.notion.so/PRML-a508bc1b861a4562bc8a13f42dbe473e?pvs=21))
            - データ集合中の支配的な相関を捉えることが可能
- これら２つのアプローチを組み合わせたり、拡張したりして、階層的モデル群を形成することにより、現実の問題に幅広く適用することができるようになる
    - **マルコフ確率場**(Markov random field)(☞[8.3節](https://www.notion.so/PRML-vo-2-e28574fff53f4d318666eea832d67241?pvs=21))
        - 画像の確率モデルとして幅広く利用されている
    - **線形動的システム**(linear dynamical system)(☞[13.3節](https://www.notion.so/PRML-vo-2-e28574fff53f4d318666eea832d67241?pvs=21))
        - トラッキングの応用など時系列データのモデル化に用いられている

### 2.3.1: 条件付きガウス分布

多変量ガウス分布の重要な特性について考察する

- 2つの変数集合のときはがガウス分布に従うなら
1. 一方の変数集合が与えられた時の、もう一方の集合の条件付き分布もガウス分布になる
2. どちらの変数集合の周辺分布も同様にガウス分布になる
- $\mathbf{x}:$  ガウス分布$\mathcal{N}(\mathbf{x}|\boldsymbol\mu, \Sigma)$に従う$D$次元ベクトル
    - このベクトルを２つの互いに素な部分集合に分割する

        $$
        \mathbf{x} =
        \begin{pmatrix}
        \mathbf{x}_a \\ \mathbf{x}_b
        \end{pmatrix}
        $$

    - 上記の部分集合に対応した平均ベクトルおよび共分散行列も以下のように定義する


        $$
        \boldsymbol\mu =
        \begin{pmatrix}
        \boldsymbol\mu_a \\ \boldsymbol\mu_b
        \end{pmatrix}
        $$

        $$
        \Sigma =
        \begin{pmatrix}
        \Sigma_{aa} & \Sigma_{ab} \\ \Sigma_{ba} & \Sigma_{bb}
        \end{pmatrix}
        $$

        - 共分散行列の対称性 $\Sigma^\top = \Sigma$ から
            - $\Sigma_{aa}, \Sigma_{bb}$ も対称となる
            - $\Sigma_{ab} = \Sigma_{ba}^\top$
    - 共分散行列の逆行列を考えた方が便利なことが多いので**精度行列**(precision matrix)として $\Lambda$ を定義する

        $$
        \Lambda \equiv \Sigma^{-1}
        $$

- 条件付き分布 $p(\mathbf{x}_a|\mathbf{x}_b)$の表現を見つける
    - 同時分布$p(\mathbf{x}) = p(\mathbf{x}_a, \mathbf{x}_b)$を用いて条件付き分布を計算する
    - ガウス分布の指数部分の二次形式について考えることで効率よく計算可能
    - ガウス分布の計算に**平方完成**(completing the square)をよく用いる

        $$
        (ガウス分布の２次形式) = -\frac{1}{2}\mathbf{x}^\top\Sigma^{-1}\mathbf{x} + \mathbf{x}^\top\Sigma^{-1}\boldsymbol\mu + \text{const}
        $$

        - $\text{const}:$  $\mathbf{x}$に非依存な項
    - 上記で定義した部分集合を用いて$\boldsymbol\mu_{a|b}, \Sigma_{a|b}$を計算する
        1. ガウス分布の二次形式を上記で定義した部分集合を用いて書き表す
        2. $\mathbf{x}_b$を定数とみなして$\mathbf{x}_a$の関数的依存性を考える
        3. 係数比較を用いると以下のような結果が得られる

            $$
            \begin{align*}
            \Sigma_{a|b} &= \Lambda_{aa}^{-1} \\
            \boldsymbol\mu_{a|b} &= \boldsymbol\mu_a - \Lambda_{aa}^{-1}\Lambda_{ab}(\mathbf{x}_b - \boldsymbol\mu_b)
            \end{align*}
            $$

    - 精度行列に対して、共分散行列を用いて表現することも可能である
        - 分割された行列の逆行列に関する以下の公式を活用することで計算できる

            $$
            \begin{pmatrix}
            \mathbf{A} & \mathbf{B} \\
            \mathbf{C} & \mathbf{D}
            \end{pmatrix}^{-1} =
            \begin{pmatrix}
            \mathbf{M} & \mathbf{-MBD^{-1}} \\
            \mathbf{-D^{-1}CM} & \mathbf{D^{-1}+D^{-1}CMBD^{-1}}
            \end{pmatrix}
            $$

            - 但し、$\mathbf{M=(A-BD^{-1}C)^{-1}}$
                - $\mathbf{M}^{-1}$は部分行列$\mathbf{D}$に関する**シューア補行列**(Schur complement matrix)

        $$
        \begin{align*}
        \Sigma_{a|b} &= \boldsymbol\mu_a+\Sigma_{ab}\Sigma_{bb}^{-1}(\mathbf{x}_b-\boldsymbol\mu_b) \\
        \boldsymbol\mu_{a|b} &= \Sigma_{aa} - \Sigma_{ab}\Sigma_{bb}^{-1}\Sigma_{ba}
        \end{align*}
        $$

        - 条件付き分布 $p(\mathbf{x}_a|\mathbf{x}_b)$の平均は$\mathbf{x}_b$の線形関数であり、共分散行列は$\mathbf{x}_b$とは独立である→**線形ガウスモデル**(linear-Gaussian model)

### 2.3.2: 周辺ガウス分布

周辺ガウス分布について考える

$$
p(\mathbf{x}_a) = \int p(\mathbf{x}_a, \mathbf{x}_b) ~d\mathbf{x}_b
$$

- こちらでも[2.3.1節](https://www.notion.so/PRML-27b7e05702d34ebf9474a830b650cab7?pvs=21)と同様に二次形式に着目し、同様の手順を踏まえる
- 結果は以下の通り

    $$
    \begin{align*}
    \mathbb{E}[\mathbf{x}_a] &= \boldsymbol\mu_a \\
    \text{cov}[\mathbf{x}_a] &= \Sigma_{aa}
    \end{align*}
    $$

    - 直感にかなり沿った非常に簡潔な表現

### 2.3.3: ガウス変数に対するベイズの定理

以後の章で頻繁に現れる以下のような問題に対する一般的な結果を算出しておく

given:

1. ガウス周辺分布$p(\mathbf{x})$
2. 平均が$\mathbf{x}$の線形関数で共分散行列が$\mathbf{x}$とは独立であるようなガウス条件付き分布$p(\mathbf{y}|\mathbf{x})$
    - **線形ガウスモデル**(linear Gaussian model)の例

goal:

1. ガウス周辺分布$p(\mathbf{y})$
2. 条件付き分布$p(\mathbf{x}|\mathbf{y})$
- 上記の条件を数式化すると以下のようになる

    $$
    \begin{align*}
    p(\mathbf{x}) &= \mathcal{N}(\mathbf{x}|\boldsymbol\mu, \Lambda^{-1}) \\
    p(\mathbf{y}|\mathbf{x}) &= \mathcal{N}(\mathbf{y}|\mathbf{A}\mathbf{x}+\mathbf{B}, \mathbf{L}^{-1})

    \end{align*}
    $$

    - $\Lambda, \mathbf{L}:$  各ガウス分布に対する精度行列
- 初めに以下のような$\mathbf{x}$と$\mathbf{y}$の同時分布を考える

    $$
    p(\mathbf{z}) = p(\mathbf{x}, \mathbf{y}) = p(\mathbf{y}|\mathbf{x})~p(\mathbf{x})
    $$

    - 二次形式部分に着目したいため対数を考える
        - $\mathbf{z}$の二次形式なので$p(\mathbf{z})$もガウス分布
        - 上記の章での手順に倣って、二次の項から$p(\mathbf{z})$の精度行列を計算する
            - $(\ln p(\mathbf{z})の二次の項) = -1/2~\mathbf{z^\top Rz}$ となるように式変形する

            $$
            \mathbf{
            R =
            \begin{pmatrix}
            \mathbf{\Lambda + A^\top L A} & \mathbf{-A^\top L} \\
            \mathbf{-LA} & \mathbf{L}
            \end{pmatrix}

            }
            $$

        - 逆行列を計算することで共分散行列も計算可能

            $$
            \mathbf{\text{cov}[z] = R^{-1} =
            \begin{pmatrix}
            \mathbf{\Lambda^{-1}} & \mathbf{\Lambda^{-1}A^\top} \\
            \mathbf{A\Lambda^{-1}} & \mathbf{L^{-1} + A\Lambda^{-1}A^\top}

            \end{pmatrix}
            }
            $$

        - 平均に関しては一次の項に着目する

        $$
        \mathbf{\mathbb{E}[z] = R^{-1}
        }
        \begin{pmatrix}
        \mathbf{\Lambda\boldsymbol\mu - A^\top L b} \\
        \mathbf{Lb}
        \end{pmatrix} = \begin{pmatrix}
        \mathbf{\boldsymbol\mu} \\
        \mathbf{A\boldsymbol\mu + b}
        \end{pmatrix}
        $$

- 次に周変化した周辺分布$p(\mathbf{y})$を考える
    - [2.3.2節](https://www.notion.so/PRML-27b7e05702d34ebf9474a830b650cab7?pvs=21)で得られた結果を活用する

        $$
        \begin{align*}
        \mathbf{\mathbb{E}[y]} &= \mathbf{A\boldsymbol\mu+b}\\
        \mathbf{\text{cov}[y]} &= \mathbf{L^{-1} + A\Lambda^{-1}A^\top}
        \end{align*}
        $$

        - 特に$\mathbf{A=I}$ (2つのガウス分布$\mathcal{N}(\mathbf{x|\boldsymbol\mu, \Lambda^{-1}}), \mathcal{N}(\mathbf{y|b, L^{-1}})$のたたみ込みになる) の場合は、平均及び共分散行列は元のガウス分布の和になる
- 最後に条件付き分布$p(\mathbf{x}|\mathbf{y})$を考える
    - [2.3.1節](https://www.notion.so/PRML-27b7e05702d34ebf9474a830b650cab7?pvs=21)で得られた結果を活用する

        $$
        \begin{align*}
        \mathbf{\mathbb{E}[x|y]} &= \mathbf{(\Lambda+A^\top LA)^{-1}\{A^\top L(y-b)+\Lambda\boldsymbol\mu\}}\\
        \mathbf{\text{cov}[x|y]} &= \mathbf{(\Lambda+A^\top LA)^{-1}}
        \end{align*}
        $$


### 2.3.4: ガウス分布の最尤推定

多変量ガウス分布から観測値$\{x_n\}$が独立に得られたと仮定したデータ集合に対して、分布のパラメータを最尤推定法で推定する

- 確率密度関数$p(\mathbf{x}|\boldsymbol\mu, \Sigma)$から対数尤度関数を計算し、それを最小化する値を計算すれば良い

$$
\begin{align*}
\boldsymbol\mu_{ML} &= \frac{1}{N}\sum_{n=1}^N\mathbf{x}_n \\
\Sigma_{ML} &= \sum_{n=1}^N(\mathbf{x}_n - \boldsymbol\mu_{ML})(\mathbf{x}_n - \boldsymbol\mu_{ML})^\top
\end{align*}
$$

- 真の分布のもとで上記で計算した最尤推定解の期待値を評価する

    $$
    \begin{align*}
    \mathbb{E}[\boldsymbol\mu_{ML}] &= \boldsymbol\mu \\
    \mathbb{E}[\Sigma_{ML}] &= \frac{N-1}{N}\Sigma
    \end{align*}
    $$

    - 共分散行列に関しては過小評価されているため不偏推定量を計算するには調整が必要
- 🧐 ただ頻度主義的な考えで計算を行っただけ

### 2.3.5: 逐次推定

データ点を一度に１つずつ処理してはそれを破棄すること

- 以下のケースで主に活躍する
    - オンラインや応用分野
    - 全てのデータを一度に一括処理することが不可能な大規模データ集合
- 平均の最尤推定量$\boldsymbol\mu_{ML}$に関して具体的に考える
    - 最後のデータ点$\mathbf{x}_N$に着目する

        $$
        \boldsymbol\mu_{ML}^{(N)} = \boldsymbol\mu_{ML}^{(N-1)} + \frac{1}{N}(\mathbf{x}_N-\boldsymbol\mu_{ML}^{(N-1)})
        $$

    - しかし、上記の方法で確実に逐次アルゴリズムを導出することが可能とは限らない
- 汎用的な逐次学習の定式化がなされた**Robbins-Monro**アルゴリズム(Robbins-Monro algorithm)を考える
    - 確率変数のパラメータ$\theta$とそれに依存する確率変数$z$の同時分布$p(z, \theta)$を考える
        - $\theta$が与えられた時の条件付き期待値 $\mathbb{E}[z|\theta]$を**回帰関数**$f(\theta)$として定義する
    - ここでの目標は$f(\theta^*) = 0$を満たす$\theta^*$を計算すること
        - 大規模なデータ集合があれば回帰関数を直接モデル化することも可能だが、今回は逐次的な方法に限定して考える
- 根 $\theta^*$の連続的推定の系列は以下のように定義する

    $$
    \theta^{(N)} = \theta^{(N-1)} - a_{N-1}z(\theta^{(N-1)})
    $$

    - $a_{N-1}$や$f(\theta)$に関して満たすべき条件は存在することに注意
    - 負の対数尤度関数に対して、$a_{N} = \sigma^2/N$となるように選ぶと、平均の最尤推定量を求める式になる
        - 🧐 要するに、(微分値) = 0を満たすようなパラメータを計算することで最大値を計算できるよねというお話(確率自身が0になる時を求めているのかと勘違いしていた…)
    - ある条件を満たした連続的推定の系列の目標の根は”確実に”収束する

        $$
        \lim_{N\rightarrow\infin}\theta^{(N)} = \theta^{*}
        $$

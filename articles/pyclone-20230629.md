---
title: "PyCloneの紹介と使い方"
emoji: "🍣"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["Github", "Python", "静的解析", "Tech"]
published: true
---

## はじめに

[PyClone](https://github.com/C-Naoki/pyclone)は、[my-python-template](https://github.com/C-Naoki/my-python-template)を効率的に利用するために私が作成したコマンドラインユーティリティです。このツールを使用すると、プロジェクトのクローン、セットアップ、GitHubへの初期バージョンのコミットを素早く行うことができます。my-python-templateに関するZennの記事は[こちら](https://zenn.dev/naoki0103/articles/my-python-template-20230629)をご覧ください。

## セットアップ

PyCloneを使用するためには、まず`pyclone`関数をシェルの設定ファイルにコピーする必要があります。Bashユーザーの場合は`.bashrc`、ZSHユーザーの場合は`.zshrc`となります。

関数の宣言は以下のようになります：

```bash
pyclone() {
    ...
}
```

## 環境変数

PyCloneを使用するためには、以下の2つの環境変数を定義する必要があります：

- `PYCLONE_PATH`: この変数には、新しいプロジェクトディレクトリを作成したいディレクトリへのパスを含める必要があります。
- `GITHUB_TOKEN`: ここにはGitHubのアクセストークンを含める必要があります。このトークンはGitHub上に新しいリポジトリを作成する際に使用されます。GitHubのアクセストークンについての詳細は、[こちら](https://docs.github.com/ja/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)をクリックしてください。

## 使用方法

PyCloneは、ターミナルで`pyclone`を呼び出すだけで起動できます。PyCloneに自動的に新しいリポジトリをGitHub上に作成し、初期コミットを行うように指示する場合は、`-g`オプションを使用できます：

```bash
pyclone -g
```

実行中に、PyCloneは仮想環境の名前を尋ねます。これは新しいプロジェクトのディレクトリ名としても使用されます。ディレクトリがすでに存在する場合、PyCloneはそれを上書きするかどうかを尋ねます。`-g`オプションが使用された場合、PyCloneは新しいリポジトリをGitHub上に公開するかどうかも尋ねます。

## PyCloneのコード解説

以下に、PyCloneの主要な部分のコードを抜粋し、それぞれが何をしているのかを詳細に説明します。

### 1. 環境変数のチェック

```bash
if [ -z "${PYCLONE_PATH}" ]; then
    echo "Error: PYCLONE_PATH is not defined. Please define PYCLONE_PATH."
    return 1
fi

clone_path=${PYCLONE_PATH}
clone_git_path=${clone_path}/git/
```

ここでは、環境変数`PYCLONE_PATH`が定義されているかどうかをチェックします。この環境変数は新しいプロジェクトディレクトリを作成する場所を指定するためのものです。定義されていない場合、エラーメッセージが表示され、関数は終了します。これにより、ユーザーは自分の環境に合わせてプロジェクトの保存場所を自由に設定できます。

### 2. オプションの解析

```bash
while getopts "g" opt; do
    case $opt in
        g)
            git_flag=1
            ;;
        \?)
            echo "Invalid option: -$OPTARG"
            return 1
            ;;
    esac
done
shift $((OPTIND -1))
```

この部分では、`getopts`を使用してコマンドラインオプションを解析します。`-g`オプションが指定された場合、`git_flag`が1に設定され、後でGitHubに新しいリポジトリを作成するために使用されます。これにより、ユーザーは新しいプロジェクトをローカルだけでなくGitHubにも作成することが可能になります。

### 3. ディレクトリ名の入力と上書きの確認

```bash
echo -n "What is the virtual environment name? [$default_dir_name]: "
read dir_name
dir_name=${dir_name:-$default_dir_name}

if [ -d "${clone_path}/${dir_name}" ] || [ -d "${clone_git_path}/${dir_name}" ]; then


default_overwrite="no"
    while : ; do
        echo -n "The directory ${dir_name} already exists. Overwrite? (yes/no) [$default_overwrite]: "
        read overwrite
        overwrite=${overwrite:-$default_overwrite}
        if [[ "$overwrite" == "yes" ]] || [[ "$overwrite" == "no" ]]; then
            break
        else
            echo "Please enter either 'yes' or 'no'."
        fi
    done
    if [[ "$overwrite" == "no" ]]; then
        echo "Operation cancelled by user."
        return 1
    fi
fi
```

ここでは、ユーザーに仮想環境の名前（新しいプロジェクトのディレクトリ名）を入力してもらいます。その後、指定された名前のディレクトリがすでに存在する場合は、それを上書きするかどうかをユーザーに尋ねます。上書きを拒否した場合、関数は終了します。これにより、既存のプロジェクトを誤って上書きすることなく、安全に新しいプロジェクトを作成することができます。

### 4. リポジトリの公開設定

```bash
if [ $git_flag -eq 1 ]; then
    while : ; do
        echo -n "Do you publish the repository? (yes/no) [$default_publish]: "
        read publish
        publish=${publish:-$default_publish}
        if [[ "$publish" == "yes" ]] || [[ "$publish" == "no" ]]; then
            break
        else
            echo "Please enter either 'yes' or 'no'."
        fi
    done
fi
```

この部分は、`-g`オプションが指定された場合にのみ実行されます。ユーザーに新しいリポジトリを公開するかどうかを尋ねます。公開する場合は`yes`、公開しない場合は`no`を入力します。これにより、ユーザーは新しいプロジェクトを公開するかプライベートにするかを自由に選択することができます。

### 5. リポジトリのクローンと初期設定

```bash
git clone https://github.com/C-Naoki/my-python-templete.git $dir_name
cd $dir_name
sed -i "" "s/my-python-templete/$dir_name/g" pyproject.toml
rm -rf .git

make install
git init

echo "# $dir_name" > README.md
```

この部分では、まずmy-python-templateリポジトリをクローンし、そのディレクトリに移動します。次に、`pyproject.toml`ファイル内のプロジェクト名を新しいディレクトリ名に置き換えます。これにより、仮想環境名がmy-python-templateのままになることを防ぎます。その後、`.git`ディレクトリを削除し、新しいgitリポジトリを初期化します。最後に、新しい`README.md`ファイルを作成し、その中に新しいディレクトリ名を書き込みます。これにより、新しいプロジェクトの基本的のセットアップを一気に行うことが可能となっています。

### 6. PyGithubのインストールチェックとリポジトリ存在チェック

```bash
if [ $git_flag -eq 1 ]; then
    repo_check_file="repo_check_$$.txt"
    python -c "
    import pkg_resources
    import time
    try:
        pkg_resources.get_distribution('PyGithub')
    except pkg_resources.DistributionNotFound:
        import subprocess
        subprocess.run(['pip', 'install', 'PyGithub'])
    finally:
        import os
        from github import Github
        g = Github(os.getenv('GITHUB_TOKEN'))
        username = g.get_user().login
        try:
            g.get_user().get_repo('$dir_name')
            print('The repository $dir_name already exists on GitHub.')
        except:
            pass
    " > $repo_check_file
    if grep -q "The repository $dir_name already exists on GitHub." $repo_check_file; then
        echo "The repository $dir_name already exists on GitHub."
        rm $repo_check_file
        return 1
    fi
    rm $repo_check_file
    ...
fi
```

この部分では、まずPythonのパッケージ管理ツール`pkg_resources`を使って、`PyGithub`がインストールされているかどうかをチェックします。`PyGithub`はGitHubのAPIをPythonから利用するためのライブラリで、このスクリプトではGitHubに新しいリポジトリを作成するために使用されます。`PyGithub`がインストールされていない場合、スクリプトは自動的に`pip install PyGithub`を実行して`PyGithub`をインストールします。これにより、ユーザーは手動でライブラリをインストールする手間を省くことができます。

その後、指定された名前のリポジトリがGitHub上にすでに存在するかどうかをチェックします。存在する場合はエラーメッセージが表示され、関数は終了します。これにより、既存のリポジトリを誤って上書きすることなく、安全に新しいリポジトリを作成することができます。また、`repo_check_file`の命名にはプロセスIDを含めることで、既存のファイルを上書きすることなく一時ファイルを作成しています。これにより、複数のプロセスが同時に実行される場合でも安全に一時ファイルを扱うことが可能となっています。

### 7. GitHubリポジトリの作成と初期コミット

```bash
if [ $git_flag -eq 1 ]; then
    ...
    username=$(python -c "
    import os
    import time
    from github import Github
    g = Github(os.getenv('GITHUB_TOKEN'))
    username = g.get_user().login
    repo = g.get_user().create_repo('$dir_name', private=('$publish' == 'no'))
    while repo.clone_url is None:
        time.sleep(0.5)
        repo = g.get_repo(f'{username}/{dir_name}')
    print(username)")

    url="https://github.com/${username}/${dir_name}.git"
    git remote add origin $url
    git add .
    git commit -m ":tada: initial commit"
    git push -u origin master
fi
```

この部分は、`-g`オプションが指定された場合にのみ実行されます。まず、新しいGitHubリポジトリを作成し、そのURLを取得します。次に、新しいリポジトリをgitのリモートとして追加し、すべてのファイルをステージングします。その後、初期コミットを作成し、それをGitHubにプッシュします。これにより、新しいプロジェクトがGitHub上にも作成され、初期の状態がコミットされます。これにより、新しいプロジェクトのバージョン管理がすぐに始められます。(シンタックスハイライトがバグっています。修正方法をご存知の方は教えていただきたいです。。。)

## まとめ

以上が、PyCloneの紹介とその主要なコードの解説でした。PyCloneは、Pythonプロジェクトのテンプレートである[my-python-template](https://github.com/C-Naoki/my-python-template)を効率的に利用するためのツールです。このツールを使用することで、新しいプロジェクトのクローン、セットアップ、GitHubへの初期バージョンのコミットを素早く行うことができます。

また、コードの解説を通じて、PyCloneがどのように動作しているか、どのような処理を行っているかの詳細な説明も行いました。これにより、ユーザーは自身のニーズに合わせてPyCloneをカスタマイズすることも可能です。

PyCloneは、Pythonプロジェクトの初期設定を効率化するための強力なツールです。これを活用することで、開発者は新しいプロジェクトのセットアップにかかる時間を大幅に削減し、より重要な開発作業に集中することができます。

もし何かバグを見つけたり、あったほうがより便利になる機能があれば、ぜひGitHubのissueに投稿してください。皆様のフィードバックは、このテンプレートをより良いものにするための大切な情報源です。皆様からのご意見、ご感想をお待ちしております。

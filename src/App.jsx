import { useState, useEffect, useMemo } from 'react';
import {
  Terminal, Server, Network, Shield, Users, Package, FileText, FolderTree,
  Check, X, ChevronRight, ArrowLeft, RotateCcw, Award, BookOpen, Sparkles,
  TrendingUp, Target, Flame, Calendar, Compass, Library, Lightbulb, Lock,
  Trophy, Hash, Clock, Monitor, Printer
} from 'lucide-react';

// ─────────────────────────────────────────────
// LPIC-1 v5.0 公式試験範囲 (101-500 / 102-500)
// ─────────────────────────────────────────────
const OBJECTIVES = [
  { id: '101.1', exam: '101', topic: '101', name: 'ハードウェア設定の決定と構成', weight: 2 },
  { id: '101.2', exam: '101', topic: '101', name: 'システムの起動', weight: 3 },
  { id: '101.3', exam: '101', topic: '101', name: 'ランレベル/ブートターゲットの変更とシャットダウン', weight: 3 },
  { id: '102.1', exam: '101', topic: '102', name: 'ハードディスクのレイアウト設計', weight: 2 },
  { id: '102.2', exam: '101', topic: '102', name: 'ブートマネージャーのインストール', weight: 2 },
  { id: '102.3', exam: '101', topic: '102', name: '共有ライブラリの管理', weight: 1 },
  { id: '102.4', exam: '101', topic: '102', name: 'Debianパッケージ管理', weight: 3 },
  { id: '102.5', exam: '101', topic: '102', name: 'RPMとYUMパッケージ管理', weight: 3 },
  { id: '102.6', exam: '101', topic: '102', name: '仮想化ゲストとしてのLinux', weight: 1 },
  { id: '103.1', exam: '101', topic: '103', name: 'コマンドラインの操作', weight: 4 },
  { id: '103.2', exam: '101', topic: '103', name: 'フィルタによるテキスト処理', weight: 2 },
  { id: '103.3', exam: '101', topic: '103', name: '基本的なファイル管理', weight: 4 },
  { id: '103.4', exam: '101', topic: '103', name: 'ストリーム・パイプ・リダイレクト', weight: 4 },
  { id: '103.5', exam: '101', topic: '103', name: 'プロセスの生成・監視・終了', weight: 4 },
  { id: '103.6', exam: '101', topic: '103', name: 'プロセス実行優先度の変更', weight: 2 },
  { id: '103.7', exam: '101', topic: '103', name: '正規表現によるテキスト検索', weight: 3 },
  { id: '103.8', exam: '101', topic: '103', name: '基本的なファイル編集', weight: 3 },
  { id: '104.1', exam: '101', topic: '104', name: 'パーティションとファイルシステムの作成', weight: 2 },
  { id: '104.2', exam: '101', topic: '104', name: 'ファイルシステム整合性の維持', weight: 2 },
  { id: '104.3', exam: '101', topic: '104', name: 'マウントとアンマウントの制御', weight: 3 },
  { id: '104.5', exam: '101', topic: '104', name: 'ファイルパーミッションと所有権の管理', weight: 3 },
  { id: '104.6', exam: '101', topic: '104', name: 'ハードリンク・シンボリックリンク', weight: 2 },
  { id: '104.7', exam: '101', topic: '104', name: 'システムファイルの検索と適切な配置', weight: 2 },
  { id: '105.1', exam: '102', topic: '105', name: 'シェル環境のカスタマイズ', weight: 4 },
  { id: '105.2', exam: '102', topic: '105', name: '簡単なスクリプトの作成', weight: 4 },
  { id: '106.1', exam: '102', topic: '106', name: 'X11のインストールと設定', weight: 2 },
  { id: '106.2', exam: '102', topic: '106', name: 'グラフィカルデスクトップ', weight: 1 },
  { id: '106.3', exam: '102', topic: '106', name: 'アクセシビリティ', weight: 1 },
  { id: '107.1', exam: '102', topic: '107', name: 'ユーザー・グループアカウントの管理', weight: 5 },
  { id: '107.2', exam: '102', topic: '107', name: 'ジョブのスケジューリング', weight: 4 },
  { id: '107.3', exam: '102', topic: '107', name: 'ローカライゼーションと国際化', weight: 3 },
  { id: '108.1', exam: '102', topic: '108', name: 'システム時刻の管理', weight: 3 },
  { id: '108.2', exam: '102', topic: '108', name: 'システムログ', weight: 4 },
  { id: '108.3', exam: '102', topic: '108', name: 'MTAの基本', weight: 3 },
  { id: '108.4', exam: '102', topic: '108', name: 'プリンタと印刷の管理', weight: 2 },
  { id: '109.1', exam: '102', topic: '109', name: 'インターネットプロトコルの基礎', weight: 4 },
  { id: '109.2', exam: '102', topic: '109', name: '永続的なネットワーク設定', weight: 4 },
  { id: '109.3', exam: '102', topic: '109', name: '基本的なネットワーク問題解決', weight: 4 },
  { id: '109.4', exam: '102', topic: '109', name: 'クライアント側DNS設定', weight: 2 },
  { id: '110.1', exam: '102', topic: '110', name: 'セキュリティ管理業務', weight: 3 },
  { id: '110.2', exam: '102', topic: '110', name: 'ホストセキュリティの設定', weight: 3 },
  { id: '110.3', exam: '102', topic: '110', name: '暗号化によるデータ保護', weight: 4 },
];

// ─────────────────────────────────────────────
// カテゴリ定義
// ─────────────────────────────────────────────
const CATEGORIES = [
  { id: 'system',     name: 'システムアーキテクチャ', subtitle: '起動と土台',     icon: Server,     accent: '#205c75', kanji: '基' },
  { id: 'install',    name: 'インストール・パッケージ', subtitle: '導入と更新',   icon: Package,    accent: '#a44a3f', kanji: '装' },
  { id: 'commands',   name: 'GNU/Unixコマンド',     subtitle: '基本操作の所作', icon: Terminal,   accent: '#163a5f', kanji: '命' },
  { id: 'filesystem', name: 'デバイス・FS・FHS',    subtitle: '階層と構造',     icon: FolderTree, accent: '#4d7c47', kanji: '構' },
  { id: 'shell',      name: 'シェルとスクリプト',   subtitle: '自動化の技',     icon: FileText,   accent: '#5d4e7c', kanji: '殻' },
  { id: 'desktop',    name: 'UI・デスクトップ',     subtitle: 'X11と画面',      icon: Monitor,    accent: '#7c5d8c', kanji: '画' },
  { id: 'admin',      name: '管理業務',             subtitle: 'ユーザと時刻',   icon: Users,      accent: '#7d6b4f', kanji: '権' },
  { id: 'service',    name: 'システムサービス',     subtitle: '常駐の調律',     icon: Printer,    accent: '#7c5d4e', kanji: '司' },
  { id: 'network',    name: 'ネットワーク',         subtitle: '通信の基礎',     icon: Network,    accent: '#205c75', kanji: '通' },
  { id: 'security',   name: 'セキュリティ',         subtitle: '安全な運用',     icon: Shield,     accent: '#a8324a', kanji: '守' },
];

// ─────────────────────────────────────────────
// 問題データ(LPIC-1 v5.0 全範囲対応・217問)
// ─────────────────────────────────────────────
const Q = (id, cat, obj, q, opts, ans, exp, snip) => ({
  id, category: cat, obj: [obj], question: q, options: opts, answer: ans, explanation: exp, snippet: snip
});

const QUESTIONS = [
  // ── 101.1 ハードウェア (5問) ──
  Q(1,'system','101.1','PCIバスに接続されたデバイスを一覧表示するコマンドはどれか。',['lsusb','lspci','lsblk','lsmod'],1,'lspci=PCI、lsusb=USB、lsblk=ブロックデバイス、lsmod=カーネルモジュール、lscpu=CPU。','$ lspci | grep -i ethernet'),
  Q(2,'system','101.1','現在ロードされているカーネルモジュールを一覧するコマンドはどれか。',['modinfo','lsmod','modload','kmod'],1,'lsmod は /proc/modules の整形表示。modprobe で追加(依存解決込み)、rmmod で除去、modinfo で詳細情報。','$ lsmod | head'),
  Q(3,'system','101.1','カーネルモジュールを依存関係解決込みでロードするコマンドはどれか。',['insmod','modprobe','depmod','lsmod'],1,'modprobe は modules.dep を参照して関連モジュールも自動ロード。insmod は単一ファイルを直接ロード(依存解決なし)。','$ sudo modprobe e1000e'),
  Q(4,'system','101.1','プロセスとカーネル情報を提供する仮想ファイルシステムはどれか。',['/dev/','/proc/','/etc/','/opt/'],1,'/proc/ はプロセスとカーネル情報。/sys/ はカーネルオブジェクトの階層、/dev/ はデバイスファイル。','$ cat /proc/cpuinfo | head'),
  Q(5,'system','101.1','デバイスのホットプラグを検知し /dev に動的にデバイスファイルを作成する仕組みはどれか。',['udev','systemd','cron','init'],0,'udev (systemd-udevd) は /etc/udev/rules.d/ の規則に従いデバイスを管理。','$ udevadm info -a -n /dev/sda'),

  // ── 101.2 起動 (4問) ──
  Q(6,'system','101.2','Linuxの一般的な起動順序として正しいものはどれか。',['BIOS/UEFI → bootloader → kernel → init/systemd','kernel → BIOS → init → bootloader','init → kernel → bootloader → BIOS','bootloader → init → kernel → BIOS'],0,'電源ON → BIOS/UEFI → ブートローダ(GRUB等) → カーネル+initramfs → init/systemd → サービスの順。','# Power → BIOS → GRUB → kernel → systemd'),
  Q(7,'system','101.2','直近のカーネルメッセージ(リングバッファ)を表示するコマンドはどれか。',['journalctl','dmesg','syslog','lastlog'],1,'dmesg はカーネルのリングバッファ。systemd環境では journalctl -k でも同じ情報。-T で人間可読日時表示。','$ dmesg -T | tail'),
  Q(8,'system','101.2','起動時にカーネルと共にメモリへ展開され初期ルートFSを提供するのはどれか。',['MBR','initramfs','GRUB','fstab'],1,'initramfs は起動初期の一時ルートFS。必要ドライバを読み本来のルートFSをマウントしてから切替える。','$ ls /boot/initramfs-*.img'),
  Q(9,'system','101.2','BIOS の後継となる新しいファームウェア規格はどれか。',['CMOS','UEFI','POST','BCD'],1,'UEFI は GPT と組み合わせ、ESP に EFI バイナリを配置。/sys/firmware/efi の有無で UEFI かどうか判別可能。','$ ls /sys/firmware/efi'),

  // ── 101.3 ランレベル/ターゲット (7問) ──
  Q(10,'system','101.3','systemd 環境でサービスを起動するコマンドはどれか。',['service start nginx','systemctl start nginx','init start nginx','rc-service nginx start'],1,'systemctl start <unit>。enable で起動時自動起動、--now で同時に起動+有効化。','$ sudo systemctl enable --now nginx'),
  Q(11,'system','101.3','SysVinit における伝統的なランレベル「6」の意味はどれか。',['停止(halt)','シングルユーザモード','マルチユーザモード','再起動(reboot)'],3,'0=停止、1(s/S)=シングル、2-3=マルチ、5=GUI、6=再起動。0/6 をデフォルトに設定すると起動できなくなる。','# /etc/inittab\nid:3:initdefault:'),
  Q(12,'system','101.3','SysVinit のランレベルを実行中に変更する伝統的なコマンドはどれか。',['runlevel','telinit','switchlevel','changelevel'],1,'telinit <レベル> で変更(init <レベル> も同義)。runlevel は現在と直前のランレベル表示のみ。','$ sudo telinit 3'),
  Q(13,'system','101.3','systemd でレスキュー(シングルユーザ)モードに切替えるコマンドはどれか。',['systemctl single','systemctl isolate rescue.target','systemctl runlevel 1','systemctl emergency'],1,'systemctl isolate rescue.target が単一ユーザ相当。emergency.target はさらに最小構成。','$ sudo systemctl isolate rescue.target'),
  Q(14,'system','101.3','GUI が起動するデフォルトの systemd ターゲットはどれか。',['multi-user.target','graphical.target','rescue.target','default.target'],1,'graphical.target=GUI、multi-user.target=CUIのみ。systemctl get-default で現状確認、set-default で変更。','$ systemctl get-default'),
  Q(15,'system','101.3','コマンドラインからシステムを即時に停止するコマンドはどれか。',['shutdown -r now','shutdown -h now','reboot','kill -9 1'],1,'-h=halt、-r=reboot、now=即時。"shutdown +5"で分後、"shutdown -c"で取消。','$ sudo shutdown -h now'),
  Q(16,'system','101.3','全ログイン端末にメッセージをブロードキャストするコマンドはどれか。',['broadcast','wall','write','mesg'],1,'wall=write to all。シャットダウン前の通告等で使用。write は個別ユーザ向け。','$ echo "再起動します" | sudo wall'),

  // ── 102.1 ディスクレイアウト (4問) ──
  Q(17,'install','102.1','別パーティションに分けることが推奨される代表的なマウントポイントの組み合わせはどれか。',['/home, /var, /boot','/tmp, /etc, /usr','/dev, /proc, /sys','/opt, /root, /lib'],0,'/home(ユーザデータ)、/var(可変データ)、/boot(ブート関連)はサイズ制御や復旧の観点で別パーティションにする慣行。','# 例: /  /home  /var  /boot  swap'),
  Q(18,'install','102.1','UEFI システムで EFI ブートローダが置かれる ESP のファイルシステム形式はどれか。',['ext4','VFAT (FAT32)','NTFS','Btrfs'],1,'ESP は VFAT/FAT32 で /boot/efi にマウントし EFI バイナリを配置。','$ mount | grep efi'),
  Q(19,'install','102.1','LVM の特徴として正しくないものはどれか。',['動的にボリュームを拡張できる','スナップショットが取れる','複数物理ディスクを統合できる','ファイルシステム作成が不要となる'],3,'LVM 上でも mkfs は必要。階層は PV(物理) → VG(グループ) → LV(論理)。','# pvcreate → vgcreate → lvcreate → mkfs'),
  Q(20,'install','102.1','物理メモリ不足時にディスク領域を仮想メモリとして使う領域はどれか。',['cache','swap','buffer','overlay'],1,'スワップは専用パーティションかファイル。mkswap で初期化、swapon で有効化、/etc/fstab で永続化。','$ sudo mkswap /dev/sda3 && sudo swapon /dev/sda3'),

  // ── 102.2 ブートマネージャ (5問) ──
  Q(21,'install','102.2','GRUB 2 の自動生成される設定ファイルパスはどれか。',['/boot/grub/menu.lst','/boot/grub/grub.cfg','/etc/grub.conf','/etc/lilo.conf'],1,'GRUB 2 は /boot/grub/grub.cfg。直接編集せず /etc/default/grub と /etc/grub.d/* を編集して grub-mkconfig で生成。','$ sudo grub-mkconfig -o /boot/grub/grub.cfg'),
  Q(22,'install','102.2','GRUB Legacy のメニュー設定ファイル名はどれか。',['grub.cfg','menu.lst','grub.conf のみ','boot.ini'],1,'GRUB Legacy(0.97系)は menu.lst(Red Hat系では grub.conf がシンボリックリンク)。GRUB 2 は grub.cfg。','# /boot/grub/menu.lst (Legacy)'),
  Q(23,'install','102.2','GRUB 2 のユーザ設定変更時に編集する代表的な場所はどれか。',['/boot/grub/grub.cfg を直接編集','/etc/default/grub と /etc/grub.d/ 配下','/etc/grub2.conf','/usr/lib/grub2.cfg'],1,'/etc/default/grub(タイムアウト等)と /etc/grub.d/(エントリ生成)を編集後、grub-mkconfig で grub.cfg 生成。','# /etc/default/grub\nGRUB_TIMEOUT=5'),
  Q(24,'install','102.2','GRUB をディスクの MBR にインストールするコマンドはどれか。',['grub-install /dev/sda','grub-mkconfig /dev/sda','grub-setup /dev/sda','install-grub /dev/sda'],0,'grub-install <デバイス> で MBR(または ESP)にブートローダを書込。Red Hat系は grub2-install。','$ sudo grub-install /dev/sda'),
  Q(25,'install','102.2','BIOS 環境のディスク先頭(LBA 0)に格納される、ブートストラップとパーティションテーブルを含む領域はどれか。',['MBR','GPT','ESP','BIOS Boot'],0,'MBR は最初の 512 バイト(ブートコード446B + パーティションテーブル64B + シグネチャ2B)。','# MBR = 512バイト'),

  // ── 102.3 共有ライブラリ (3問) ──
  Q(26,'install','102.3','実行ファイルが依存している共有ライブラリの一覧を表示するコマンドはどれか。',['ldconfig','ldd','libdep','so-list'],1,'ldd <実行ファイル> で動的リンクされたライブラリと解決先を表示。','$ ldd /usr/bin/ls'),
  Q(27,'install','102.3','共有ライブラリのキャッシュ(/etc/ld.so.cache)を再構築するコマンドはどれか。',['ldd','ldconfig','libupdate','updatedb'],1,'ldconfig は /etc/ld.so.conf と /etc/ld.so.conf.d/ を走査してキャッシュを再構築。','$ sudo ldconfig'),
  Q(28,'install','102.3','共有ライブラリの追加検索パスを一時的に指定する環境変数はどれか。',['LIBPATH','LD_LIBRARY_PATH','PATH','CPATH'],1,'LD_LIBRARY_PATH は : 区切り。標準のライブラリ検索より先に参照される。','$ export LD_LIBRARY_PATH=/opt/myapp/lib'),

  // ── 102.4 Debian (6問) ──
  Q(29,'install','102.4','Debian系でパッケージインデックスを更新するコマンドはどれか。',['apt install','apt update','apt upgrade','apt search'],1,'apt update はインデックス取得のみ。実体の更新は apt upgrade。','$ sudo apt update && sudo apt upgrade'),
  Q(30,'install','102.4','dpkg でインストール済みパッケージの一覧を表示するオプションはどれか。',['dpkg -l','dpkg -i','dpkg -r','dpkg -L'],0,'-l 一覧、-i 導入、-r 削除、-L 内容、-S 該当ファイル検索。','$ dpkg -l | grep nginx'),
  Q(31,'install','102.4','apt のキャッシュからパッケージ名と説明を検索するコマンドはどれか。',['apt show','apt-cache search','apt list','dpkg -s'],1,'apt-cache search <キーワード> でローカル索引を検索。apt search も同等。','$ apt-cache search "image viewer"'),
  Q(32,'install','102.4','パッケージを設定ファイルごと完全削除する apt サブコマンドはどれか。',['apt remove','apt purge','apt erase','apt clean'],1,'remove はバイナリのみ、purge は設定ファイルも削除。autoremove は不要依存パッケージ削除。','$ sudo apt purge nginx'),
  Q(33,'install','102.4','導入済みパッケージを対話的に再設定するコマンドはどれか。',['dpkg-reconfigure','dpkg --setup','apt-config','dpkg -R'],0,'dpkg-reconfigure は debconf 経由で設定値を再入力。tzdata, locales 等で頻繁に使う。','$ sudo dpkg-reconfigure tzdata'),
  Q(34,'install','102.4','apt が使うリポジトリ定義のメインファイルはどれか。',['/etc/apt/repos.list','/etc/apt/sources.list','/etc/apt.conf','/var/lib/apt/lists/'],1,'/etc/apt/sources.list と /etc/apt/sources.list.d/ 配下の *.list でリポジトリ定義。','# /etc/apt/sources.list'),

  // ── 102.5 RPM/YUM/Zypper (5問) ──
  Q(35,'install','102.5','Red Hat系で依存関係を自動解決する高レベルパッケージ管理ツールはどれか。',['rpm','dnf','tar','make'],1,'dnf(YUM の後継)は依存関係を自動解決。rpm は低レベル。','$ sudo dnf install httpd'),
  Q(36,'install','102.5','「指定ファイルを提供するパッケージ」を検索する rpm のオプションはどれか。',['rpm -qa','rpm -qf','rpm -ql','rpm -qi'],1,'-qf <ファイルパス> で所有パッケージを問合せ。-qa 全一覧、-ql 内容、-qi 詳細。','$ rpm -qf /usr/bin/ls'),
  Q(37,'install','102.5','yum/dnf のリポジトリ定義ファイルが置かれるディレクトリはどれか。',['/etc/yum/','/etc/yum.repos.d/','/etc/dnf.d/','/var/lib/yum/'],1,'/etc/yum.repos.d/ 配下に *.repo。主設定は /etc/yum.conf や /etc/dnf/dnf.conf。','$ ls /etc/yum.repos.d/'),
  Q(38,'install','102.5','SUSE 系で使われるパッケージ管理コマンドはどれか。',['apt','dnf','zypper','pacman'],2,'zypper は openSUSE/SLES の高レベル管理。zypper install/remove/up/se 等。','$ sudo zypper install nginx'),
  Q(39,'install','102.5','RPM パッケージの内容を CPIO アーカイブとして展開するコマンドはどれか。',['rpm -x','rpm2cpio','rpm-extract','cpio2rpm'],1,'rpm2cpio package.rpm | cpio -idmv で中身展開。インストールせず確認したい時に有用。','$ rpm2cpio nginx.rpm | cpio -idmv'),

  // ── 102.6 仮想化 (2問) ──
  Q(40,'install','102.6','仮想マシン(VM)とコンテナの最大の違いはどれか。',['VMは独立したカーネルを持ち、コンテナはホストOSのカーネルを共有する','VMは無料でコンテナは有料','VMはLinux限定でコンテナは全OS対応','本質的に違いはない'],0,'VM はハイパーバイザ上で完全なゲストOSを動かす。コンテナはホストカーネルを共有し名前空間と cgroup でプロセス隔離する。','# VM: Guest Kernel / Container: Host Kernel'),
  Q(41,'install','102.6','クラウドインスタンス起動時の初期設定(SSH鍵投入・ホスト名設定等)を行う標準ツールはどれか。',['cloud-init','init-cloud','awsctl','systemd-cloud'],0,'cloud-init は AWS/GCP/Azure 等で広く採用される初期化ツール。','#cloud-config\nhostname: webserver'),

  // ── 103.1 コマンドライン (6問) ──
  Q(42,'commands','103.1','カーネルのバージョン文字列のみを表示する uname のオプションはどれか。',['uname -a','uname -r','uname -m','uname -n'],1,'-r カーネルリリース、-a 全情報、-m アーキテクチャ、-n ホスト名、-s カーネル名、-o OS名。','$ uname -r'),
  Q(43,'commands','103.1','過去に実行したコマンドの履歴を表示するコマンドはどれか。',['last','history','past','log'],1,'history で履歴。!番号 で再実行、!! で直前再実行、Ctrl+R 検索。実体は ~/.bash_history。','$ history | tail'),
  Q(44,'commands','103.1','man の章番号「8」が示す内容はどれか。',['ユーザコマンド','システムコール','設定ファイル','システム管理コマンド'],3,'1=ユーザコマンド、2=syscall、3=ライブラリ、5=設定、8=管理コマンド。','$ man 8 mount'),
  Q(45,'commands','103.1','env と set の違いとして正しいものはどれか。',['envは環境変数のみ、setはシェル変数+関数+オプションも含む','まったく同じ','envは書込専用','setは変数を消去する'],0,'env(=printenv)はエクスポート済み環境変数のみ。set はシェル変数・関数・シェルオプションすべて。','$ env | head'),
  Q(46,'commands','103.1','シングルクォートとダブルクォートの違いはどれか。',['シングルは変数展開しない、ダブルは展開する','まったく同じ','シングルだけがコマンド置換可能','どちらも展開しない'],0,"シングルは内部を文字通り。ダブルは $変数 と $() を展開、バックスラッシュエスケープも有効。",'$ echo \'$A\' "$A"'),
  Q(47,'commands','103.1','シェル変数を子プロセスへ継承させるコマンドはどれか。',['set','export','declare','env'],1,'export VAR=value で環境変数化。env 表示、set シェル変数全般、unset 削除。','$ export EDITOR=vim'),

  // ── 103.2 フィルタ (8問) ──
  Q(48,'commands','103.2','ファイルの末尾10行を表示する標準的なコマンドはどれか。',['head','tail','last','cat'],1,'tail は末尾(既定で10行)。-n 行数、-f 追記をリアルタイム監視。','$ tail -n 20 -f /var/log/syslog'),
  Q(49,'commands','103.2','ファイル先頭から5行のみを表示するコマンドはどれか。',['head -n 5 file','tail -n 5 file','cat -5 file','less -5 file'],0,'head -n 5(head -5)で先頭5行。デフォルトは10行。','$ head -n 5 /etc/passwd'),
  Q(50,'commands','103.2','長いテキストを前後にスクロールして閲覧する代表的なページャはどれか。',['cat','more','less','echo'],2,'less は双方向スクロール+検索。more は前進のみ。/ で検索、q で終了。','$ less /var/log/syslog'),
  Q(51,'commands','103.2',': 区切りファイルから 1 列目だけを抽出する最も簡潔な方法はどれか。',['awk -F:','cut -d: -f1','split','sed'],1,"cut -d ':' -f 1。-f は 1,3 や 1-3 のような複数指定も可能。",'$ cut -d: -f1 /etc/passwd'),
  Q(52,'commands','103.2','数値として並び替えるための sort のオプションはどれか。',['sort','sort -r','sort -n','sort -k'],2,'-n 数値、-r 逆順、-k 列指定、-u 重複除去、-h 人間可読。','$ du -h * | sort -hr'),
  Q(53,'commands','103.2','出現回数とともに重複を集約する慣用パイプラインはどれか。',['sort | uniq -c','cat | sort','wc -l','find | sort'],0,'uniq は隣接重複しか除けないため事前に sort。-c で出現回数を頭に出力。','$ sort log | uniq -c | sort -rn'),
  Q(54,'commands','103.2','ファイルの行数を数える wc のオプションはどれか。',['wc -c','wc -l','wc -w','wc -L'],1,'-l 行数、-w 単語数、-c バイト数、-m 文字数、-L 最大行長。','$ wc -l /etc/passwd'),
  Q(55,'commands','103.2','小文字を大文字に変換する tr の正しい記述はどれか。',['tr a-z A-Z','tr A-Z a-z','tr -u','tr -upper'],0,'tr <変換元> <変換先>。-d 削除、-s 連続を1つに圧縮。','$ echo "hello" | tr a-z A-Z'),

  // ── 103.3 ファイル管理 (11問) ──
  Q(56,'commands','103.3','ディレクトリを中身ごと再帰的にコピーする cp のオプションはどれか。',['cp -a','cp -r','cp -i','cp -f'],1,'-r/-R 再帰。-a はアーカイブ(再帰+属性保持+symlink維持)で推奨。-p 属性保持、-i 上書き確認。','$ cp -a ./src/ ./backup/'),
  Q(57,'commands','103.3','隠しファイルも含めて表示する ls のオプションはどれか。',['ls -l','ls -a','ls -h','ls -R'],1,'-a (all) は隠しファイル(. で始まる)も全表示。-l 長形式、-h 人間可読、-R 再帰、-t 時刻順。','$ ls -la ~/'),
  Q(58,'commands','103.3','存在しない親ディレクトリも含めて作成する mkdir のオプションはどれか。',['mkdir -p','mkdir -r','mkdir -m','mkdir -v'],0,'-p (parents) で必要な親ディレクトリも作成。既存でもエラーにしない。','$ mkdir -p /opt/app/logs'),
  Q(59,'commands','103.3','空ファイルを作成、または既存ファイルのタイムスタンプを更新するコマンドはどれか。',['create','touch','make','new'],1,'touch は無ければ新規作成、あれば時刻更新。-t で時刻指定、-r で参照ファイルの時刻を採用。','$ touch report.md'),
  Q(60,'commands','103.3','ファイル種別(テキスト/ELF/画像)を判定するコマンドはどれか。',['type','file','stat','info'],1,'file はマジックナンバーから種別判定。type はシェル組込判定、stat は inode 詳細。','$ file /usr/bin/ls'),
  Q(61,'commands','103.3','24時間以内に変更されたファイルを find で検索する正しい指定はどれか。',['find . -mtime -1','find . -mtime +1','find . -ctime 24','find . -atime 1h'],0,'-mtime -1 は「1日(24時間)未満」、+1 は「1日より前」、1 は「ちょうど1日前」。','$ find /var/log -mtime -1 -name "*.log"'),
  Q(62,'commands','103.3','find で見つけたファイルにコマンドを実行する正しい記法はどれか。',['find . -exec rm {} \\;','find . -run rm','find . -do rm','find . -with rm'],0,'-exec <コマンド> {} \\; で各ファイルに実行。+ なら 1 コマンドで複数ファイル(xargs風)。','$ find . -name "*.tmp" -exec rm {} \\;'),
  Q(63,'commands','103.3','gzip 圧縮した tar アーカイブを作成する正しいオプションはどれか。',['tar xzf','tar czf','tar tzf','tar uzf'],1,'c=create, z=gzip, f=ファイル指定。展開は xzf、一覧は tzf。bzip2は j、xzは J。','$ tar czf backup.tar.gz /home/user'),
  Q(64,'commands','103.3','.tar.bz2 アーカイブの中身を一覧表示する正しいオプションはどれか。',['tar xjf','tar tjf','tar czf','tar -j'],1,'t=list、j=bzip2。展開は xjf、作成は cjf。','$ tar tjf archive.tar.bz2 | head'),
  Q(65,'commands','103.3','ブロックデバイスをバイト単位でそのまま複製する低水準コマンドはどれか。',['cp','dd','tar','cat'],1,'dd は if/of/bs 指定。誤操作で全データ喪失するため慎重に。','$ sudo dd if=/dev/sda of=/backup/sda.img bs=4M'),
  Q(66,'commands','103.3','ワイルドカード「[a-c]*」が一致するのはどれか。',['a, b, cで始まる任意名のファイル','"[a-c]"を含む名前','a, b, cのみ','すべてのファイル'],0,'[…] は文字クラス。[a-c] は a/b/c の1文字。* は0文字以上、? は1文字。','$ ls [a-c]*'),

  // ── 103.4 リダイレクト (4問) ──
  Q(67,'commands','103.4','標準出力をファイルへ追記するリダイレクト記号はどれか。',['>','>>','<','|'],1,'> 上書き、>> 追記、< 標準入力、| パイプ。2> 標準エラー、&> 両方。','$ echo "log" >> /var/log/custom.log'),
  Q(68,'commands','103.4','標準エラー出力(2)を標準出力(1)にマージする記法はどれか。',['1>2','2>&1','1&>2','merge=err'],1,'2>&1 は「fd 2 を fd 1 にリダイレクト」。"> file 2>&1" の順序が重要。bash 略記 &>。','$ make > build.log 2>&1'),
  Q(69,'commands','103.4','標準入力をファイルに書きつつ標準出力にも流すコマンドはどれか。',['echo','tee','dup','fork'],1,'tee は T字分岐: 出力に流しつつファイルに書く。-a 追記。"| sudo tee" は権限のあるファイルへの定番。','$ ls | tee files.txt'),
  Q(70,'commands','103.4','標準入力をコマンドの引数に展開して別コマンドへ渡すツールはどれか。',['pipe','xargs','args','map'],1,'xargs は標準入力を引数列に変換。-I {} 位置指定、-n 個数、-P 並列、-0 NULL区切り。','$ find . -name "*.tmp" | xargs rm'),

  // ── 103.5 プロセス (9問) ──
  Q(71,'commands','103.5','動作中のプロセスを継続的にモニタリングする対話的コマンドはどれか。',['ps','top','jobs','kill'],1,'top はリアルタイム表示。ps はスナップショット。CPU/メモリでソート可能。','$ top -d 2'),
  Q(72,'commands','103.5','システム稼働時間とロードアベレージを表示するコマンドはどれか。',['date','uptime','who','cal'],1,'uptime は現在時刻・稼働時間・ログインユーザ数・1/5/15分のロードアベレージを一行表示。','$ uptime'),
  Q(73,'commands','103.5','プロセスの親子関係を木構造で可視化するコマンドはどれか。',['ps','pstree','top','pgrep'],1,'pstree は親→子を樹状表示。-p PID付き、-u ユーザ表示、-a 引数表示。','$ pstree -p'),
  Q(74,'commands','103.5','名前パターンに一致する複数のプロセスIDを取得するコマンドはどれか。',['ps grep','pgrep','find','lsof'],1,'pgrep は名前にマッチする PID を出力。-l 名前併記、-u ユーザ。pkill は同条件でシグナル送信。','$ pgrep -lu nginx'),
  Q(75,'commands','103.5','プロセスを強制終了するシグナル番号と名前はどれか。',['9 / SIGKILL','15 / SIGTERM','1 / SIGHUP','2 / SIGINT'],0,'SIGKILL(9)は捕捉・無視できない強制終了。通常は SIGTERM(15) → 効かなければ SIGKILL の順。','$ kill -9 12345'),
  Q(76,'commands','103.5','kill コマンドで番号を指定しなかった場合に既定で送られるシグナルはどれか。',['SIGKILL (9)','SIGTERM (15)','SIGHUP (1)','SIGSTOP (19)'],1,'kill PID は既定で SIGTERM(15)。アプリは SIGTERM を受信して片付けてから終了できる。','$ kill 12345'),
  Q(77,'commands','103.5','バックグラウンドで実行中のジョブを表示するコマンドはどれか。',['bg','fg','jobs','ps -j'],2,'jobs は現在のシェルのジョブ一覧。fg=前面、bg=BG再開、& でBG実行、Ctrl+Z で停止。','$ sleep 60 &\n$ jobs'),
  Q(78,'commands','103.5','ターミナル切断後もプロセスを継続させるコマンドはどれか。',['daemon','nohup','detach','background'],1,'nohup <コマンド> & は SIGHUP を無視。出力は nohup.out へ。screen/tmux は対話的に再接続も可能。','$ nohup ./long_task.sh &'),
  Q(79,'commands','103.5','空きメモリとスワップ使用量を表示するコマンドはどれか。',['mem','free','top -m','vmstat'],1,'free はメモリとスワップの利用状況。-h 人間可読、-m MB単位、-s で秒間隔反復。','$ free -h'),

  // ── 103.6 優先度 (3問) ──
  Q(80,'commands','103.6','プロセスの nice 値の範囲はどれか。',['0 から 100','-20 から 19','-100 から 100','1 から 32'],1,'nice 値は -20(最高優先度)〜19(最低)。デフォルトは0。負値の設定には root 権限が必要。','$ ps -o pid,ni,cmd'),
  Q(81,'commands','103.6','コマンドを低い優先度(nice 値 +10)で起動するコマンドはどれか。',['nice -n 10 cmd','renice 10 cmd','priority 10 cmd','run -p 10 cmd'],0,'nice -n 10 <コマンド> で起動時に nice 値を加算。デフォルト引数無しでは +10。','$ nice -n 10 tar czf big.tar.gz /huge/'),
  Q(82,'commands','103.6','実行中のプロセスの nice 値を変更するコマンドはどれか。',['nice','renice','reschedule','nicemod'],1,'renice -n <値> -p <PID>。-u でユーザの全プロセス、-g でグループ。','$ sudo renice -n 5 -p 12345'),

  // ── 103.7 正規表現 (4問) ──
  Q(83,'commands','103.7','grep -v "error" の動作として正しいものはどれか。',['"error"を含む行のみ抽出','"error"を含まない行を表示','"error"を行番号付きで表示','大小区別なしで検索'],1,'-v 反転マッチ。-i 大小区別なし、-n 行番号、-r 再帰、-l 一致したファイル名のみ。','$ grep -v "error" /var/log/app.log'),
  Q(84,'commands','103.7','拡張正規表現(ERE)を使って grep するための起動方法はどれか。',['grep -e','grep -E (= egrep)','grep -r','grep -x'],1,'-E(=egrep)で ERE。+ ? | () がそのまま特殊。BRE では \\+ \\? が必要。','$ grep -E "error|warn" log.txt'),
  Q(85,'commands','103.7','sed でファイル中の "old" を "new" に行内全置換するコマンドはどれか。',['sed s/old/new/ file','sed s/old/new/g file','sed -e old=new file','sed replace old new file'],1,'s/<検索>/<置換>/g の g で行内全置換。-i でファイル直接書換、-n と p で抽出表示。',"$ sed -i 's/old/new/g' file.txt"),
  Q(86,'commands','103.7','正規表現で「行頭がERROR」を表す表記はどれか。',['^ERROR','ERROR$','*ERROR','?ERROR'],0,'^ 行頭、$ 行末。^ERROR で行頭が ERROR、ERROR$ で行末が ERROR。',"$ grep '^ERROR' /var/log/app.log"),

  // ── 103.8 vi (5問) ──
  Q(87,'commands','103.8','vi で入力モード(挿入)からコマンドモードへ戻るキーはどれか。',['Enter','ESC','Tab',':'],1,'ESC でコマンドモード。i a o R c で入力モード、: で ex モード。h j k l で移動。','# i で挿入 → ESC でコマンド → :wq'),
  Q(88,'commands','103.8','vi で「保存して終了」を行うコマンドはどれか。',[':q',':wq',':save',':quit'],1,':wq は write+quit。ZZ も同等。:q! 破棄、:w! 強制保存、:x 変更があれば保存して終了。',':wq    # 保存して終了'),
  Q(89,'commands','103.8','vi で現在行を削除するコマンドはどれか。',['x','dd','dw','D'],1,'dd で1行削除、5dd で5行。dw 単語、x 1文字、D 行末まで。yy コピー、p 貼付け。','# 3dd で3行削除し p で貼付け'),
  Q(90,'commands','103.8','vi で文字列を順方向に検索するコマンドはどれか。',['/','?','find','s'],0,'/<文字列> 順方向、?<文字列> 逆方向。n 次、N 前。:%s/old/new/g で全置換。','/error\nn       # 次の一致へ'),
  Q(91,'commands','103.8','コマンドが使う標準のテキストエディタを指定する環境変数はどれか。',['EDITOR','VIEWER','PAGER','TEXTEDIT'],0,'EDITOR(と VISUAL)で指定。crontab -e、git commit、sudoedit 等が参照する。','$ export EDITOR=vim'),

  // ── 104.1 パーティション/FS作成 (5問) ──
  Q(92,'filesystem','104.1','空のパーティションに ext4 ファイルシステムを作成するコマンドはどれか。',['fdisk /dev/sda1','mkfs.ext4 /dev/sda1','mount /dev/sda1','tune2fs /dev/sda1'],1,'mkfs.ext4(または mkfs -t ext4)でフォーマット。fdisk はパーティション操作、tune2fs は ext系の調整。','$ sudo mkfs.ext4 /dev/sdb1'),
  Q(93,'filesystem','104.1','GPT パーティションを操作する代表的なコマンドはどれか。',['fdisk','gdisk','cfdisk','mkfs'],1,'gdisk は GPT 専用。最近の fdisk は GPT 対応。parted は両対応で柔軟、cfdisk は対話的TUI。','$ sudo gdisk /dev/sdb'),
  Q(94,'filesystem','104.1','GPT が MBR より優れる点として正しいものはどれか。',['2TB超のディスクと128個までのパーティションを既定で扱える','動作が高速','Linux専用','暗号化が必須'],0,'MBR は最大 2TB・基本 4 区画。GPT は 9.4ZB 級・既定 128 区画。UEFI と組合わせるのが現代的。','# MBR: 2TB / 4 / GPT: 9.4ZB / 128'),
  Q(95,'filesystem','104.1','スワップ領域を有効化する正しい手順はどれか。',['mkswap → swapon','swapadd','mountするだけ','swapinit'],0,'mkswap でスワップ署名作成 → swapon で有効化。/etc/fstab に "swap defaults 0 0" で永続化。','$ sudo mkswap /dev/sdb2 && sudo swapon /dev/sdb2'),
  Q(96,'filesystem','104.1','コピーオンライト・スナップショット・サブボリューム・複数デバイス対応を備えた現代的なLinuxファイルシステムはどれか。',['ext2','VFAT','Btrfs','ISO9660'],2,'Btrfs は CoW、サブボリューム、スナップショット、複数デバイス、圧縮、オンラインリサイズを提供。','$ sudo mkfs.btrfs /dev/sdb1'),

  // ── 104.2 整合性 (5問) ──
  Q(97,'filesystem','104.2','マウント済みファイルシステムのディスク使用量と空き容量を表示するコマンドはどれか。',['du','df','fsck','lsblk'],1,'df はマウント単位の容量。-h 人間可読、-T 種別表示、-i inode 表示。','$ df -hT'),
  Q(98,'filesystem','104.2','指定ディレクトリ配下の合計サイズを表示するコマンドはどれか。',['df','du','free','ls'],1,'du はディレクトリ階層の使用量を再帰的に集計。-h 人間可読、-s 集計のみ、--max-depth=N。','$ du -sh /var/log'),
  Q(99,'filesystem','104.2','ファイルシステムの整合性をチェック・修復する汎用コマンドはどれか。',['fdisk','fsck','mkfs','tune2fs'],1,'fsck は適切な fsck.<種別> を呼ぶフロントエンド。アンマウント済みで実行。-y 確認なし修復、-N ドライラン。','$ sudo fsck -y /dev/sdb1'),
  Q(100,'filesystem','104.2','ext系ファイルシステムのパラメータを調整するコマンドはどれか。',['tune2fs','mkfs.ext4','fsck.ext4','e2label'],0,'tune2fs は ext2/3/4 の調整。-L ラベル、-c マウント回数、-m 予約ブロック割合、-l 情報表示。','$ sudo tune2fs -L data /dev/sdb1'),
  Q(101,'filesystem','104.2','XFS ファイルシステムの修復に使うコマンドはどれか。',['fsck.xfs','xfs_repair','xfs_check','xfs_fix'],1,'XFS は xfs_repair で修復(従来の fsck.xfs は何もせず終了)。アンマウント必須。xfs_db デバッガ、xfs_fsr デフラグ。','$ sudo xfs_repair /dev/sdb1'),

  // ── 104.3 マウント (5問) ──
  Q(102,'filesystem','104.3','システム起動時に自動マウントするファイルシステムを記述する設定ファイルはどれか。',['/etc/mtab','/etc/fstab','/etc/mount.conf','/etc/disks'],1,'/etc/fstab は永続マウント設定。フィールドは「device mount-point fs-type options dump fsck-pass」。','# /etc/fstab\nUUID=xxx  /  ext4  defaults  0 1'),
  Q(103,'filesystem','104.3','/etc/fstab で UUID 指定が推奨される主な理由はどれか。',['/dev/sdXはカーネル認識順で変動するがUUIDは不変','UUIDはパスワードで保護される','速度向上のため','Windows互換のため'],0,'USB追加等でデバイス名は変わり得る。UUID は FS 作成時に決まり再フォーマットしない限り不変。','$ blkid /dev/sda1'),
  Q(104,'filesystem','104.3','ブロックデバイスの階層と種別を木構造で表示するコマンドはどれか。',['fdisk -l','lsblk','df','mount'],1,'lsblk は親ディスク→パーティション→LVM等の階層表示。-f で FS種別とUUID、-o で表示列指定。','$ lsblk -f'),
  Q(105,'filesystem','104.3','デバイスの UUID とラベル、ファイルシステム種別を確認するコマンドはどれか。',['fdisk -l','blkid','df -T','mount -l'],1,'blkid はブロックデバイスの UUID/LABEL/TYPE 表示。引数なしで全デバイス。','$ sudo blkid'),
  Q(106,'filesystem','104.3','マウント中のファイルシステムを安全にアンマウントするコマンドはどれか。',['unmount','umount','remove-mount','detach'],1,'umount(unmount ではない)。-l 遅延、-f 強制(NFS等)。デバイス名・マウントポイントどちらでも可。','$ sudo umount /mnt/usb'),

  // ── 104.5 パーミッション (6問) ──
  Q(107,'filesystem','104.5','パーミッション "755" の所有者の権限はどれか。',['読み込みのみ','読み取り・書き込み','読み取り・書き込み・実行','実行のみ'],2,'755 = rwxr-xr-x。所有者は7(rwx=4+2+1)、グループとその他は5(r-x=4+1)。','$ chmod 755 script.sh'),
  Q(108,'filesystem','104.5','ファイルの所有者と所有グループを同時に変更する正しい記法はどれか。',['chown user file','chown user:group file','chown user.group:file','chgrp user:group file'],1,'chown user:group file 形式。: の代わりに . も使えるが : 推奨。-R 再帰。','$ sudo chown alice:dev project.txt'),
  Q(109,'filesystem','104.5','SUID ビットを設定する数値パーミッションはどれか。',['1755','2755','4755','7755'],2,'4xxx で SUID(実行時に所有者の権限)、2xxx で SGID、1xxx でスティッキー。chmod u+s でも SUID 設定可能。','$ ls -l /usr/bin/passwd'),
  Q(110,'filesystem','104.5','umask の値が "022" のとき、新規作成される一般ファイルのパーミッションはどれか。',['755','644','666','600'],1,'一般ファイルは 666 から umask を引く: 666 - 022 = 644。ディレクトリは 777 から: 777 - 022 = 755。','$ umask 022 && touch a.txt'),
  Q(111,'filesystem','104.5','/tmp に設定されているスティッキービットの効果はどれか。',['全員が読み書きできるが削除は所有者のみ可能','全員削除可能','書込禁止','自動圧縮される'],0,'スティッキー付ディレクトリは書込権限があっても他人のファイルは削除不可。ls の末尾 "t" で確認。','$ ls -ld /tmp\ndrwxrwxrwt'),
  Q(112,'filesystem','104.5','SUID と SGID(実行ファイル)の違いはどれか。',['SUIDは実行時に所有者の権限、SGIDは実行時にグループの権限で動作','どちらも同じ機能','SUIDはディレクトリ専用','SGIDは読み取り専用化'],0,'実行ファイルでは SUID(4xxx)が所有者、SGID(2xxx)がグループの権限で動く。SGID をディレクトリに付けると新規ファイルが親グループを継承。','$ ls -l /usr/bin/passwd  # SUID'),

  // ── 104.6 リンク (2問) ──
  Q(113,'filesystem','104.6','シンボリックリンクを作成するコマンドはどれか。',['ln target link','ln -s target link','cp -s target link','mv -s target link'],1,'ln -s で symlink。-s なしの ln はハードリンク。symlink は別 inode でパス名を保持し FS をまたげる。','$ ln -s /usr/bin/python3 /usr/local/bin/python'),
  Q(114,'filesystem','104.6','ハードリンクとシンボリックリンクの違いはどれか。',['ハードリンクは同じinodeを指し、シンボリックリンクは別inodeでパス名を保持','まったく同じ','ハードリンクは異なるFSをまたげる','シンボリックリンクは削除できない'],0,'ハードリンクは inode 共有(同じ実体)、FS をまたげない、ディレクトリ不可。symlink は別 inode・元削除でリンク切れ。','$ ls -li  # 同じinode番号=ハードリンク'),

  // ── 104.7 検索/FHS (4問) ──
  Q(115,'filesystem','104.7','FHS において一時ファイルが配置される標準ディレクトリはどれか。',['/var','/tmp','/etc','/opt'],1,'/tmp は一時ファイル(再起動でクリアの場合あり)。/var/tmp は再起動を跨ぐ一時データ。/var は可変データ全般。','$ ls -ld /tmp'),
  Q(116,'filesystem','104.7','デバイスファイルが配置されるディレクトリはどれか。',['/dev','/proc','/sys','/mnt'],0,'/dev はキャラクタ/ブロックデバイス。/proc プロセス情報、/sys カーネル情報。','$ ls /dev/sd*'),
  Q(117,'filesystem','104.7','コマンド名から PATH 上の実行ファイルの場所を表示するコマンドはどれか。',['where','which','find','locate'],1,'which は PATH を順に検索。type はシェル組込判定可、whereis はバイナリ・man・ソース全方位。','$ which python3'),
  Q(118,'filesystem','104.7','locate のデータベースを再構築するコマンドはどれか。',['locate -u','updatedb','refreshdb','locate --rebuild'],1,'updatedb で /var/lib/mlocate/mlocate.db 更新。設定 /etc/updatedb.conf。通常は cron で日次実行。','$ sudo updatedb'),

  // ── 105.1 シェル環境 (5問) ──
  Q(119,'shell','105.1','環境変数 PATH に新しいディレクトリを追加する正しい記述はどれか。',['PATH=/opt/bin','PATH=$PATH:/opt/bin','export /opt/bin','set PATH /opt/bin'],1,'PATH=$PATH:/opt/bin で既存PATHを保持し追加。: 区切り。先頭に書くと優先。export で子プロセス継承。','$ export PATH=$PATH:/opt/bin'),
  Q(120,'shell','105.1','ログインシェル時に読み込まれる代表的なユーザ設定ファイルはどれか。',['~/.bashrc','~/.bash_profile','/etc/shells','~/.bash_history'],1,'ログインシェル: ~/.bash_profile → ~/.bash_login → ~/.profile の順で最初の1つ。非ログイン対話: ~/.bashrc。','# ~/.bash_profile\n[ -f ~/.bashrc ] && . ~/.bashrc'),
  Q(121,'shell','105.1','コマンドの別名(alias)を恒久化するために通常記述するファイルはどれか。',['/etc/passwd','~/.bashrc','/etc/hosts','~/.profile'],1,'alias は対話的非ログインシェルでも有効化したいので ~/.bashrc。alias 単独で一覧、unalias で解除。',"# ~/.bashrc\nalias ll='ls -la'"),
  Q(122,'shell','105.1','スクリプトを現在のシェルで実行(変数を継承)するコマンドはどれか。',['bash file.sh','./file.sh','. file.sh (= source file.sh)','sh -c file.sh'],2,'. または source は現シェル内で実行。bash や ./ では子プロセスで実行され変数が消える。','$ source ~/.bashrc'),
  Q(123,'shell','105.1','システム全体のログインシェル用初期化ファイルはどれか。',['/etc/bash.bashrc','/etc/profile','/etc/shells','/etc/login.defs'],1,'/etc/profile はログインシェル時に全ユーザで読まれる。/etc/bash.bashrc は対話的非ログイン bash 用(ディストロ依存)。','$ cat /etc/profile'),

  // ── 105.2 シェルスクリプト (10問) ──
  Q(124,'shell','105.2','シェルスクリプトの先頭に書くインタプリタ指定行(シバン)の正しい例はどれか。',['#/bin/bash','#!/bin/bash','!#/bin/bash','//bin/bash'],1,'#!(シバン)に続けてインタプリタの絶対パス。#!/usr/bin/env bash は移植性が高い。','#!/bin/bash\necho "Hello"'),
  Q(125,'shell','105.2','直前に実行したコマンドの終了ステータスを参照する変数はどれか。',['$!','$#','$?','$$'],2,'$? 直前ステータス(0=正常)、$! 直前BG PID、$$ 現プロセスPID、$0 スクリプト名。','$ echo $?'),
  Q(126,'shell','105.2','シェルスクリプトに渡された引数の個数を表す変数はどれか。',['$0','$#','$@','$*'],1,'$# 引数の個数、$0 名前、$1〜$9 各引数、$@ と $* 全引数(クォート挙動異なる)、shift でずらす。','echo "args: $#  first: $1"'),
  Q(127,'shell','105.2','bash の if 文を閉じる正しいキーワードはどれか。',['endif','fi','end','}'],1,'if〜fi、case〜esac、for/while〜done。bash は開始キーワードを逆さに綴って閉じるものが多い。','if [ -f file ]; then\n  echo ok\nfi'),
  Q(128,'shell','105.2','bash の case 文を閉じる正しいキーワードはどれか。',['end','esac','done','fi'],1,'case を逆に綴った esac で閉じる。各分岐は ;; で区切る。','case "$x" in\n  a) echo A;;\nesac'),
  Q(129,'shell','105.2','bash で関数を定義する正しい構文はどれか。',['fn name() { ... }','function name() { ... } または name() { ... }','def name() { ... }','sub name { ... }'],1,'function キーワードと () のどちらか(または両方)で定義。引数は $1, $2…、戻り値は 0-255 を return。','greet() { echo "hi $1"; }'),
  Q(130,'shell','105.2','シェルスクリプトの位置パラメータをひとつ前にずらすコマンドはどれか。',['next','shift','pop','move'],1,'shift で $2→$1、$3→$2…。while [ $# -gt 0 ] と組合わせ引数を順に処理する定番パターン。','while [ $# -gt 0 ]; do echo "$1"; shift; done'),
  Q(131,'shell','105.2','シェルスクリプトの実行をトレース表示するオプションはどれか。',['bash -v','bash -x','bash -d','bash -t'],1,'-x は実行行を「+」付きで表示。-v はソース行を読込時に表示。スクリプト内で set -x / set +x で部分指定可。','$ bash -x script.sh'),
  Q(132,'shell','105.2','コマンドの出力を変数に取り込むコマンド置換の正しい記法はどれか。',['$cmd','$(cmd) または `cmd`','%cmd%','<cmd>'],1,'$(...)(推奨)または `...`(古典)。ネスト可能なのは $(...) のみ。','NOW=$(date +%F)'),
  Q(133,'shell','105.2','標準入力から1行読み込んで変数 NAME に格納する正しい記述はどれか。',['get NAME','read NAME','input NAME','stdin NAME'],1,'read [-r] [-p "プロンプト"] [-s] 変数。-s で表示しない(パスワード入力)、-p でプロンプト。','read -p "name? " NAME'),

  // ── 106.1 X11 (5問) ──
  Q(134,'desktop','106.1','X Window System のクライアント・サーバ関係として正しいものはどれか。',['Xサーバが画面と入力を担い、Xクライアントがアプリ本体','Xクライアントが画面、Xサーバがアプリ','Xはクライアント・サーバ構造を持たない','どちらも常にローカルに存在する'],0,'X はネットワーク透過。X サーバが入出力(画面/キーボード)、X クライアントがアプリ本体。リモートクライアントを手元のサーバに表示できる。','$ DISPLAY=:0 xeyes'),
  Q(135,'desktop','106.1','X クライアントの表示先を指定する環境変数はどれか。',['SCREEN','DISPLAY','XSERVER','X_HOST'],1,'DISPLAY=ホスト名:ディスプレイ番号.スクリーン番号 (例: :0, hostname:0.0)。SSH X11転送時は自動設定。','$ echo $DISPLAY'),
  Q(136,'desktop','106.1','X サーバへの接続をホスト単位で制御する古典的なコマンドはどれか。',['xauth','xhost','xaccess','xperm'],1,'xhost +<host> 許可、-<host> 拒否。xauth は MIT-MAGIC-COOKIE による鍵ベース(より安全)。','$ xhost +localhost'),
  Q(137,'desktop','106.1','X11 の伝統的な設定ファイルパスはどれか。',['/etc/X11/xorg.conf と /etc/X11/xorg.conf.d/','/etc/X.conf','/etc/x11/config','~/.x11rc のみ'],0,'主設定は /etc/X11/xorg.conf。最近は /etc/X11/xorg.conf.d/ 配下に分割した *.conf。','$ ls /etc/X11/xorg.conf.d/'),
  Q(138,'desktop','106.1','X11 の後継として開発されているモダンな表示プロトコルはどれか。',['Mir','Wayland','XFree86','DirectFB'],1,'Wayland は X11 を置き換える次世代プロトコル。GNOME・KDE が標準採用。XWayland で X11 アプリの互換実行可能。','$ echo $XDG_SESSION_TYPE'),

  // ── 106.2 デスクトップ (2問) ──
  Q(139,'desktop','106.2','Linux の代表的な統合デスクトップ環境の組合わせはどれか。',['Gnome / KDE / Xfce','Aero / Metro / Fluent','Cocoa / Carbon / Aqua','Win32 / WinUI / WPF'],0,'主要 DE: Gnome(GTK), KDE Plasma(Qt), Xfce(軽量), MATE, Cinnamon, LXQt。Display Manager(GDM/SDDM/LightDM)経由が一般的。','$ echo $XDG_CURRENT_DESKTOP'),
  Q(140,'desktop','106.2','Windows 環境からリモートデスクトップに接続する代表的なプロトコルはどれか。',['SSH','NFS','RDP','SMTP'],2,'RDP(Remote Desktop Protocol)は Microsoft 由来。Linux では xrdp で受側を提供、freerdp/remmina でクライアント。VNC は別系統。','# RDP server: xrdp / VNC: x11vnc'),

  // ── 106.3 アクセシビリティ (2問) ──
  Q(141,'desktop','106.3','視覚障害者向けに画面の文字情報を音声で読み上げるソフトウェアはどれか。',['Screen Magnifier','Screen Reader','High Contrast Theme','Sticky Keys'],1,'スクリーンリーダ(Orca等)はテキストを音声化。Magnifier は拡大、High Contrast は配色、Sticky Keys は同時押し補助。','# GNOME: Orca, Brl: brltty'),
  Q(142,'desktop','106.3','同時に複数キーを押すのが困難なユーザのため、修飾キーを順に押せるようにする機能はどれか。',['Bounce Keys','Slow Keys','Sticky Keys','Mouse Keys'],2,'Sticky Keys: 修飾キー(Shift/Ctrl)を「押しっぱなし」状態に保持。Slow Keys: 一定時間押下で認識、Bounce Keys: 連打抑止、Mouse Keys: テンキーでカーソル操作。','# Settings → Universal Access'),

  // ── 107.1 ユーザ管理 (8問) ──
  Q(143,'admin','107.1','暗号化されたパスワードハッシュが格納されているファイルはどれか。',['/etc/passwd','/etc/shadow','/etc/group','/etc/gshadow'],1,'/etc/shadow にパスワードハッシュ(rootのみ読取可)。/etc/passwd のパスワード欄は "x"。/etc/gshadow はグループパスワード。','$ sudo head -1 /etc/shadow'),
  Q(144,'admin','107.1','ホームディレクトリも併せて作成する useradd のオプションはどれか。',['-h','-m','-d','-c'],1,'-m はホーム作成(/etc/skel/ から複製)。-d ホーム位置、-s シェル、-c コメント、-G 補助グループ、-u UID。','$ sudo useradd -m -s /bin/bash -G sudo alice'),
  Q(145,'admin','107.1','既存ユーザを既存の補助グループに追加する正しいコマンドはどれか。',['usermod -G docker alice','usermod -aG docker alice','useradd -g docker alice','gpasswd alice'],1,'-aG は append + supplementary group。-G のみだと既存補助グループから外れるので -a が重要。','$ sudo usermod -aG docker alice'),
  Q(146,'admin','107.1','新規ユーザのホームに自動コピーされる雛形ファイルが置かれるディレクトリはどれか。',['/etc/default/','/etc/skel/','/etc/users/','/var/skel/'],1,'/etc/skel/ が雛形。.bashrc, .profile, README 等を置くと useradd -m 時に複製される。','$ ls -la /etc/skel/'),
  Q(147,'admin','107.1','現ユーザの UID・GID・所属グループをまとめて表示するコマンドはどれか。',['whoami','id','groups','users'],1,'id は UID/GID/補助グループを一行で表示。引数にユーザ名で他ユーザも調査可能。','$ id'),
  Q(148,'admin','107.1','パスワードの有効期限・警告日数を変更するコマンドはどれか。',['passwd -e','chage','usermod -E のみ','shadowctl'],1,'chage は -M 最大有効日数、-W 警告日数、-E 失効日、-d 最終変更日。chage -l で現状表示。','$ sudo chage -M 90 -W 7 alice'),
  Q(149,'admin','107.1','NSS 経由でユーザ情報を引くコマンドはどれか。',['cat /etc/passwd','getent passwd','who','id'],1,'getent は /etc/nsswitch.conf に従うので LDAP 等の外部統合環境でも一貫してデータが取れる。passwd, group, hosts 等。','$ getent passwd alice'),
  Q(150,'admin','107.1','グループを新規作成するコマンドはどれか。',['groupadd','addgroup','newgroup','group -a'],0,'groupadd <名前> で作成。-g GID 指定、-r システムグループ。groupmod 変更、groupdel 削除。','$ sudo groupadd developers'),

  // ── 107.2 ジョブ (5問) ──
  Q(151,'admin','107.2','一般ユーザが自分の cron ジョブを編集するコマンドはどれか。',['crontab -l','crontab -e','cron -e','edit /etc/crontab'],1,'crontab -e 編集、-l 表示、-r 削除。/etc/crontab はシステム全体用、/etc/cron.d/ にも分割設定可能。','$ crontab -e'),
  Q(152,'admin','107.2','cron の書式「分 時 日 月 曜日」で「毎週日曜の朝3時」を表すのはどれか。',['0 3 * * 0','3 0 * * 7','0 3 0 * *','* * 3 7 0'],0,'分=0, 時=3, 日=*, 月=*, 曜日=0(日曜)。曜日は 0/7 が日曜、1=月、…、6=土。','0 3 * * 0  /usr/local/bin/weekly.sh'),
  Q(153,'admin','107.2','一度だけ指定時刻に実行するスケジューラはどれか。',['cron','anacron','at','systemd-timer'],2,'at <時刻> でその時刻に1回実行。atq 一覧、atrm 取消。/etc/at.allow と /etc/at.deny でアクセス制御。','$ echo "/path/cmd" | at 23:00'),
  Q(154,'admin','107.2','systemd timer ユニットを使うメリットはどれか。',['cronに比べてサービス単位の依存関係や状態管理が可能','完全にcronと同じ','シェルが必須','GUI専用'],0,'systemd timer は対応する .service と組み、依存・状態・ログが journalctl で見える。systemctl list-timers で一覧。','$ systemctl list-timers --all'),
  Q(155,'admin','107.2','cron へのアクセスを許可するユーザを列挙する設定ファイルはどれか。',['/etc/cron.allow','/etc/cron.users','/etc/cron.d/users','/etc/cron/permit'],0,'/etc/cron.allow があれば列挙ユーザのみ許可。なければ /etc/cron.deny 列挙ユーザのみ拒否。両方なければ root のみ。','# /etc/cron.allow\nalice'),

  // ── 107.3 ローカライゼーション (4問) ──
  Q(156,'admin','107.3','シェルで日付出力を一時的に C ロケール(英語)に固定する正しい方法はどれか。',['LANG=C date','EXPORT C','locale C','setlocale C'],0,'一時的なロケール上書きはコマンドの前に "VAR=val"。LANG=C は C(POSIX)ロケールにする慣用句。','$ LANG=C date'),
  Q(157,'admin','107.3','すべてのロケールカテゴリを最優先で上書きする環境変数はどれか。',['LANG','LC_ALL','LC_CTYPE','LANGUAGE'],1,'LC_ALL > LC_* > LANG の優先順位。LC_TIME(時刻)、LC_NUMERIC(数値)、LC_MESSAGES(言語)等の個別変数も。','$ LC_ALL=ja_JP.UTF-8 date'),
  Q(158,'admin','107.3','文字コードを変換する標準コマンドはどれか。',['iconv','cat -e','convert','transcode'],0,'iconv -f SHIFT_JIS -t UTF-8 のように形式変換。-l 対応エンコーディング一覧。','$ iconv -f SJIS -t UTF-8 sjis.txt > utf8.txt'),
  Q(159,'admin','107.3','タイムゾーンを設定する systemd 系コマンドはどれか。',['date set','timedatectl set-timezone','tz','zoneadm'],1,'timedatectl set-timezone Asia/Tokyo。内部的に /etc/localtime のシンボリックリンクを更新。','$ sudo timedatectl set-timezone Asia/Tokyo'),

  // ── 108.1 時刻 (4問) ──
  Q(160,'service','108.1','システム時刻と現在の状態を表示する systemd 系コマンドはどれか。',['date','timedatectl','hwclock','tzselect'],1,'timedatectl は systemd 統合の時刻管理。status/set-time/set-timezone/set-ntp 等。NTP 同期状況も確認可能。','$ timedatectl status'),
  Q(161,'service','108.1','ハードウェアクロック(RTC)を読み書きするコマンドはどれか。',['date','hwclock','rtcclock','bios-time'],1,'hwclock 操作。--show 表示、--systohc システム→RTC、--hctosys RTC→システム、--utc / --localtime で形式指定。','$ sudo hwclock --systohc --utc'),
  Q(162,'service','108.1','ntpd の代替として近年広く使われる、復帰の速い時刻同期デーモンはどれか。',['ntpd','chronyd','timed','rdate'],1,'chronyd はネットワーク不安定環境やノートPC向き。設定 /etc/chrony.conf、操作 chronyc。','$ chronyc tracking'),
  Q(163,'service','108.1','世界中の標準的な NTP サーバ群を提供するプロジェクト名はどれか。',['time.org','pool.ntp.org','ntp.pool.io','world-ntp.net'],1,'pool.ntp.org は世界各地のNTPサーバ群を地域別にDNS振り分け。jp.pool.ntp.org のように国別も指定可能。','# pool 0.jp.pool.ntp.org iburst'),

  // ── 108.2 ログ (6問) ──
  Q(164,'service','108.2','システムログが標準的に格納されるディレクトリはどれか。',['/etc/log','/var/log','/home/log','/usr/log'],1,'/var/log がシステムおよびアプリケーションのログ標準格納先。journald 採用環境では /var/log/journal/ にバイナリログ。','$ tail -f /var/log/syslog'),
  Q(165,'service','108.2','systemd journal からカーネルメッセージのみを表示するオプションはどれか。',['journalctl -u','journalctl -k','journalctl -f','journalctl --boot'],1,'-k カーネルメッセージのみ(dmesg 同等)。-u ユニット指定、-f リアルタイム追従、--since 時刻指定、-p 優先度、-b ブート単位。','$ journalctl -k --since "10 min ago"'),
  Q(166,'service','108.2','rsyslog の設定で「auth.* /var/log/auth.log」が意味するものはどれか。',['authファシリティの全優先度を/var/log/auth.logに書く','authファイルをauth.logにコピー','認証を拒否する','SSHの設定'],0,'書式は「ファシリティ.優先度 アクション」。* は全優先度。ファシリティは auth/cron/mail/kern等、優先度は emerg〜debug の8段階。','# /etc/rsyslog.conf\nauth.*  /var/log/auth.log'),
  Q(167,'service','108.2','ログファイルを定期的に世代管理(回転・圧縮・削除)するツールはどれか。',['rsyslog','logrotate','journalctl','cron'],1,'logrotate は /etc/logrotate.conf と /etc/logrotate.d/ 配下の定義に従う。cron(/etc/cron.daily/logrotate)で日次起動。','# /etc/logrotate.d/nginx\n/var/log/nginx/*.log {\n  daily\n  rotate 14\n  compress\n}'),
  Q(168,'service','108.2','コマンドラインからログを syslog/journal に書き込むツールはどれか。',['logger','syslog','logwrite','journal-add'],0,'logger -t タグ -p ファシリティ.優先度 "メッセージ"。スクリプトからログを残すのに使う。systemd-cat も同用途。','$ logger -t myapp -p user.info "started"'),
  Q(169,'service','108.2','journalctl で「直近1時間以内のログ」を表示する正しいオプションはどれか。',['journalctl -n 1h','journalctl --since "1 hour ago"','journalctl -p 1h','journalctl --recent 60'],1,'--since と --until は時刻指定。"yesterday" "1 hour ago" 等。-n 行数、-p 優先度。','$ journalctl --since "1 hour ago" -u nginx'),

  // ── 108.3 MTA (4問) ──
  Q(170,'service','108.3','メールエイリアスを設定し MTA に反映させる手順として正しいものはどれか。',['/etc/aliases を編集 → newaliases を実行','/etc/passwd を編集','/etc/hosts を編集','mailq を実行する'],0,'/etc/aliases に「alias: target」を書き newaliases (sendmail -bi) で /etc/aliases.db を生成。','# /etc/aliases\nroot: alice\n$ sudo newaliases'),
  Q(171,'service','108.3','代表的な MTA(メール配送エージェント)の組合わせはどれか。',['postfix, exim, sendmail','nginx, apache','vsftpd, proftpd','bind, unbound'],0,'主要 MTA は postfix / exim / sendmail。nginx・apache は Web、bind・unbound は DNS、vsftpd 等は FTP。','# postfix/exim/sendmail = MTA'),
  Q(172,'service','108.3','メールキュー(送信待ち・遅延中)を表示するコマンドはどれか。',['mailx','mailq','queue','spool'],1,'mailq は送信待ち・延滞メール一覧。実体は /var/spool/postfix 等。postqueue -p や exim -bp も同等。','$ mailq'),
  Q(173,'service','108.3','ユーザ自身が受信メールの転送先を指定するファイルはどれか。',['/etc/aliases','~/.forward','~/.mailrc','/etc/mail.conf'],1,'~/.forward は各ユーザのホームに置き、1行ごとに転送先メールアドレスを記述。MTA がローカル配送時に参照。','# ~/.forward\nalice@example.com'),

  // ── 108.4 印刷 (4問) ──
  Q(174,'service','108.4','現代の Linux で標準的に使われる印刷システムはどれか。',['LPD','LPRng','CUPS','BSD print'],2,'CUPS(Common Unix Printing System)が現代標準。Web UI(http://localhost:631/)で管理。設定は /etc/cups/ 配下。','$ sudo systemctl status cups'),
  Q(175,'service','108.4','ファイルを印刷キューに送る古典的なコマンドはどれか。',['lpr','lprm','lpq','lpstat'],0,'lpr はジョブ投入。lprm 削除、lpq キュー表示、lpstat プリンタ・ジョブ状態。CUPS でも互換コマンドとして提供。','$ lpr -P printer1 report.pdf'),
  Q(176,'service','108.4','印刷キューの内容を表示するコマンドはどれか。',['lpr','lprm','lpq','lpcheck'],2,'lpq はキュー表示(q=queue)。-P でプリンタ指定、-a 全プリンタ。lpstat -o も同様。','$ lpq -P printer1'),
  Q(177,'service','108.4','CUPS の設定ファイルや PPD ファイルが置かれるディレクトリはどれか。',['/etc/printers/','/etc/cups/','/var/cups/','/usr/cups/'],1,'/etc/cups/ に cupsd.conf, printers.conf, ppd/ 等。スプールは /var/spool/cups/。','$ ls /etc/cups/'),

  // ── 109.1 IPプロトコル (7問) ──
  Q(178,'network','109.1','プライベートIPv4アドレスの範囲として正しいものはどれか。',['172.10.0.0/16','10.0.0.0/8','169.254.0.0/16','224.0.0.0/4'],1,'プライベートIP: 10.0.0.0/8、172.16.0.0/12、192.168.0.0/16。169.254/16 リンクローカル、224/4 マルチキャスト。','# 私用範囲: 10/8, 172.16/12, 192.168/16'),
  Q(179,'network','109.1','サブネットマスク /24 (255.255.255.0) で利用可能なホスト数はどれか。',['256','255','254','253'],2,'/24 は 2^8 = 256 アドレス。ネットワークアドレスとブロードキャストを除き、ホスト用は 254 個。','# 192.168.1.0/24 → .1〜.254'),
  Q(180,'network','109.1','SSH のデフォルトポート番号はどれか。',['21','22','23','25'],1,'SSH=22(TCP)、FTP=21、Telnet=23、SMTP=25、DNS=53、HTTP=80、POP3=110、HTTPS=443。','$ grep "^Port" /etc/ssh/sshd_config'),
  Q(181,'network','109.1','一般的な NTP のポート番号はどれか。',['53','80','123','443'],2,'NTP=UDP/123。覚えるべき頻出: 22 SSH, 25 SMTP, 53 DNS, 80 HTTP, 110 POP3, 123 NTP, 143 IMAP, 161/162 SNMP, 443 HTTPS, 993 IMAPS, 995 POP3S。','$ sudo ss -tulnp | grep 123'),
  Q(182,'network','109.1','IPv6 アドレスのビット長はどれか。',['32 bit','64 bit','128 bit','256 bit'],2,'IPv6 は 128bit。: 区切り 8 ブロック(各 16bit)。:: で連続 0 を1度だけ省略可能。fe80::/10 リンクローカル。','# 例: 2001:db8::1'),
  Q(183,'network','109.1','TCP と UDP の違いとして正しいものはどれか。',['TCPはコネクション指向で再送制御あり、UDPはコネクションレスで再送なし','TCPは無料、UDPは有料','どちらも同じプロトコル','TCPはIPv6専用'],0,'TCP は3ウェイハンドシェイク・順序保証・再送。UDP は到達保証なしだが軽量(DNS, NTP, 動画)。ICMP はネットワーク層の制御メッセージ。','# TCP: HTTP, SSH / UDP: DNS, NTP / ICMP: ping'),
  Q(184,'network','109.1','サービス名とポート番号の対応が記述されているファイルはどれか。',['/etc/services','/etc/protocols','/etc/networks','/etc/ports'],0,'/etc/services にサービス名・ポート番号・プロトコルが記載。getservbyname() や getservbyport() が参照。','$ grep ssh /etc/services'),

  // ── 109.2 永続的設定 (4問) ──
  Q(185,'network','109.2','/etc/hosts の主な役割はどれか。',['静的なホスト名⇄IPの対応','DNSサーバ自体の設定','ルーティングテーブル','ファイアウォール設定'],0,'/etc/hosts は単純なテキストの静的マッピング。/etc/nsswitch.conf の "hosts: files dns" で参照順を制御。','# /etc/hosts\n127.0.0.1  localhost'),
  Q(186,'network','109.2','NetworkManager 環境で使う代表的な CLI ツールはどれか。',['ifconfig','nmcli','iptables','route'],1,'nmcli は NetworkManager の CLI。connection/device/general を操作。nmtui は TUI 版。','$ nmcli device status'),
  Q(187,'network','109.2','ホスト名を永続的に変更する systemd 系コマンドはどれか。',['hostname','hostnamectl','sethostname','edit-hostname'],1,'hostnamectl set-hostname <名前> は /etc/hostname を更新。hostname 単独だと一時的(再起動で消える)。','$ sudo hostnamectl set-hostname webserver'),
  Q(188,'network','109.2','ホスト名を保存する標準ファイルはどれか。',['/etc/hostname','/etc/host','/etc/hosts','/etc/sysconfig/host'],0,'/etc/hostname に1行でホスト名。systemd 環境では hostnamectl 経由で更新するのが推奨。','$ cat /etc/hostname'),

  // ── 109.3 ネット問題解決 (6問) ──
  Q(189,'network','109.3','ネットワークインタフェースの IP アドレスを表示する現代的なコマンドはどれか。',['ifconfig','ip addr','netstat','route'],1,'ip addr (ip a) は iproute2 の現代的コマンド。ifconfig は多くの環境で非推奨化。ip link, ip route, ip neigh も活用。','$ ip addr show eth0'),
  Q(190,'network','109.3','ルーティングテーブルを表示する iproute2 のコマンドはどれか。',['route','ip route','netstat -r','arp'],1,'ip route が現代的。ip route add default via 192.168.1.1 でデフォルトGW追加。route(net-tools)は古典的。','$ ip route'),
  Q(191,'network','109.3','TCP/UDP の待機ポートとリッスン中のプロセスを確認する現代的なコマンドはどれか。',['netstat -t','ss -tlnp','ping','traceroute'],1,'ss は netstat の後継で高速。-t TCP、-u UDP、-l LISTEN、-n 数値、-p プロセス、-a 全状態。','$ sudo ss -tlnp'),
  Q(192,'network','109.3','リモートホストへの中継経路を可視化するコマンドはどれか。',['ping','traceroute','nslookup','arp'],1,'traceroute は中継ルータを順に表示。-I ICMP、-T TCP、-n 逆引き省略。tracepath は権限不要。','$ traceroute www.example.com'),
  Q(193,'network','109.3','TCP/UDP に小さなデータを送受信できる「ネットワークのスイスアーミーナイフ」はどれか。',['ping','nc (netcat)','dig','arp'],1,'nc(ncat とも)は任意ポートに接続・待受可能。-z ポート疎通、-l LISTEN、-u UDP。簡易ファイル転送・サーバ実装にも使う。','$ nc -zv example.com 443'),
  Q(194,'network','109.3','ICMP エコー要求でリモートホストへの到達性を確認するコマンドはどれか。',['ping','tracert','reach','icmp'],0,'ping は ICMP Echo Request/Reply で到達性確認。-c 回数、-i 間隔、-s パケットサイズ。IPv6 は ping6 または ping -6。','$ ping -c 4 8.8.8.8'),

  // ── 109.4 DNS (3問) ──
  Q(195,'network','109.4','DNS の問い合わせ先(ネームサーバ)を設定するファイルはどれか。',['/etc/hosts','/etc/resolv.conf','/etc/network/interfaces','/etc/nsswitch.conf'],1,'/etc/resolv.conf に nameserver, search, options を記述。最近は systemd-resolved が動的に管理することも多い。','$ cat /etc/resolv.conf\nnameserver 8.8.8.8'),
  Q(196,'network','109.4','DNS 問い合わせの詳細(レコード種別・TTL・サーバ等)を調べる定番コマンドはどれか。',['ping','dig','host','whois'],1,'dig は構造的に応答を表示し AUTHORITY/ADDITIONAL も見える。host は簡潔版、nslookup は古典的。','$ dig +short example.com\n$ dig MX example.com'),
  Q(197,'network','109.4','名前解決の参照順序(files・dns・ldap 等)を制御する設定ファイルはどれか。',['/etc/resolv.conf','/etc/nsswitch.conf','/etc/host.conf','/etc/hosts'],1,'/etc/nsswitch.conf の hosts: 行で順序指定。例: "hosts: files dns" は /etc/hosts を先に DNS を後に参照。','# hosts: files dns'),

  // ── 110.1 セキュリティ管理 (7問) ──
  Q(198,'security','110.1','一般ユーザが管理者権限で個別のコマンドを実行するコマンドはどれか。',['su','sudo','passwd','login'],1,'sudo は許可されたユーザが特権コマンドを実行。設定は /etc/sudoers(visudo で編集)。-u で他ユーザ実行。','$ sudo systemctl restart nginx'),
  Q(199,'security','110.1','sudo の権限設定を安全に編集するためのコマンドはどれか。',['vi /etc/sudoers','visudo','sudoedit /etc/sudoers','nano /etc/sudoers'],1,'visudo は構文チェック付き編集。直接エディタで編集すると構文エラーで sudo が使えなくなる危険。','$ sudo visudo'),
  Q(200,'security','110.1','シェルから単一プロセスのリソース上限を表示・設定するコマンドはどれか。',['limits','ulimit','quota','cgroup'],1,'ulimit -a 全項目表示。-n 開けるファイル数、-u プロセス数、-v 仮想メモリ、-c コアダンプ。永続化は /etc/security/limits.conf。','$ ulimit -a\n$ ulimit -n 4096'),
  Q(201,'security','110.1','現在ログイン中のユーザ・端末・ログイン時刻を一覧する基本コマンドはどれか。',['last','who','id','history'],1,'who は /var/run/utmp 参照で現在のログイン表示。w は同様+負荷情報、last 履歴(/var/log/wtmp)、lastb 失敗履歴(/var/log/btmp)。','$ who\n$ last -n 10'),
  Q(202,'security','110.1','指定ファイルやディレクトリを使用中のプロセスを表示するコマンドはどれか。',['lsof','fuser','pgrep','who'],1,'fuser は対象ファイル/ディレクトリ/ポートを使用中の PID を出力。-k で kill、-m マウントポイント全体、-v 詳細。','$ sudo fuser -v /var/log/syslog'),
  Q(203,'security','110.1','SUID ビットを設定する数値パーミッションはどれか。',['1755','2755','4755','7755'],2,'4xxx で SUID(実行時に所有者の権限で動作)。2xxx は SGID、1xxx はスティッキー。','$ ls -l /usr/bin/passwd'),
  Q(204,'security','110.1','ホストの開放ポートをスキャンする外部ツールはどれか。',['ping','nmap','tracert','nslookup'],1,'nmap はポートスキャナ。-sS SYNステルス、-sU UDP、-O OS判定、-p ポート指定。利用許諾のある対象のみに使用。','$ sudo nmap -sS -p 22,80,443 target.example.com'),

  // ── 110.2 ホストセキュリティ (5問) ──
  Q(205,'security','110.2','一般ユーザのログインを一時的に拒否するために作成するファイルはどれか。',['/etc/nologin','/etc/login.deny','/etc/passwd.lock','/etc/shadow.lock'],0,'/etc/nologin が存在すると root 以外のログインが拒否される。ファイル内容はメッセージとして表示。メンテ時に活用。','$ sudo touch /etc/nologin'),
  Q(206,'security','110.2','TCP wrappers でホストごとのアクセス許可・拒否を定義するファイルの組はどれか。',['/etc/hosts.allow と /etc/hosts.deny','/etc/allow と /etc/deny','/etc/services.allow と .deny','/etc/wrappers.conf'],0,'TCP wrappers は libwrap リンクのデーモンに対し /etc/hosts.allow → /etc/hosts.deny の順で評価。許可優先。','# /etc/hosts.allow\nsshd: 192.168.1.0/24'),
  Q(207,'security','110.2','パスワードハッシュを /etc/passwd から分離して /etc/shadow に保存する仕組みの名称はどれか。',['Crypt password','Shadow password','Hidden password','Salt password'],1,'シャドウパスワード方式。/etc/passwd は誰でも読める一方、ハッシュは /etc/shadow(rootのみ読取)に隔離。pwconv/pwunconv で切替。','$ sudo head -1 /etc/shadow'),
  Q(208,'security','110.2','使われていないネットワークサービスを停止する systemd 環境のコマンドはどれか。',['service stop','systemctl disable --now <unit>','rc.d stop','killall network'],1,'systemctl disable は自動起動無効化、--now で同時に停止。chkconfig は SysVinit 時代の同等コマンド。','$ sudo systemctl disable --now telnet.socket'),
  Q(209,'security','110.2','inetd 系の代替で必要時にサービスを起動する古典的スーパーサーバはどれか。',['xinetd','crond','systemd-init','sshd'],0,'xinetd は inetd の機能拡張版。/etc/xinetd.conf と /etc/xinetd.d/ で個別サービス設定。systemd 環境では systemd.socket が同等。','# /etc/xinetd.d/echo'),

  // ── 110.3 暗号化 (8問) ──
  Q(210,'security','110.3','新しい SSH 鍵ペアを作成するコマンドはどれか。',['ssh-add','ssh-keygen','ssh-copy-id','ssh-agent'],1,'ssh-keygen で生成。-t 種別(ed25519推奨)、-b ビット長、-f 出力先、-C コメント。秘密鍵は 600 必須。','$ ssh-keygen -t ed25519 -C "user@example"'),
  Q(211,'security','110.3','SSH 鍵認証で、サーバ側に登録する公開鍵を記述するファイルはどれか。',['~/.ssh/id_rsa','~/.ssh/known_hosts','~/.ssh/authorized_keys','/etc/ssh/sshd_config'],2,'~/.ssh/authorized_keys にクライアントの公開鍵を一行ずつ追加。パーミッションは 600、~/.ssh は 700 必須。','$ cat ~/.ssh/id_ed25519.pub | ssh user@host "cat >> ~/.ssh/authorized_keys"'),
  Q(212,'security','110.3','SSH 接続時に参照される ~/.ssh/known_hosts の役割はどれか。',['接続済みサーバの公開鍵指紋を保存しなりすましを検知','自分の秘密鍵を保存','authorized_keysのキャッシュ','SSH設定のバックアップ'],0,'初回接続時にサーバの公開鍵指紋を保存。次回以降、指紋が異なれば中間者攻撃の警告を出す。/etc/ssh/ssh_known_hosts はシステム全体用。','$ ssh-keygen -F example.com'),
  Q(213,'security','110.3','ssh-agent の役割はどれか。',['秘密鍵をメモリに保持し再入力なしで認証する','ファイアウォールを構成する','公開鍵を生成する','SSHサーバ機能を提供する'],0,'ssh-agent は復号した秘密鍵をメモリ上に保持。ssh-add で鍵を追加。エージェント転送(-A)も可能だが多段では取扱注意。','$ eval "$(ssh-agent)"\n$ ssh-add ~/.ssh/id_ed25519'),
  Q(214,'security','110.3','SSH の局所→遠隔ポート転送(ローカルフォワード)を設定するオプションはどれか。',['-L','-R','-D','-X'],0,'-L 局所→遠隔(ローカルフォワード)、-R 遠隔→局所(リモートフォワード)、-D ダイナミック(SOCKS)、-X X11転送、-A エージェント転送。','$ ssh -L 8080:internal:80 user@gateway'),
  Q(215,'security','110.3','SSH サーバ自身のホスト鍵が格納されるディレクトリはどれか。',['~/.ssh/','/etc/ssh/','/var/ssh/','/usr/share/ssh/'],1,'/etc/ssh/ssh_host_<種別>_key が秘密鍵、 .pub が公開鍵。種別は rsa/ecdsa/ed25519。クライアント設定は /etc/ssh/ssh_config。','$ sudo ls -l /etc/ssh/ssh_host_*'),
  Q(216,'security','110.3','GnuPG で鍵ペアを生成するコマンドはどれか。',['gpg --full-generate-key','ssh-keygen','openssl genrsa','pgp-create'],0,'gpg --full-generate-key (新)、--gen-key (簡易)。鍵は ~/.gnupg/ に格納。--list-keys, --export, --import, --sign, --encrypt を組合わせ運用。','$ gpg --full-generate-key'),
  Q(217,'security','110.3','GnuPG で鍵を失効させるために事前に作成しておくものはどれか。',['失効証明書(revocation certificate)','パスフレーズ','バックアップ鍵','共通鍵'],0,'失効証明書は鍵生成時に gpg --gen-revoke で作成し別の安全な場所に保管。鍵紛失・漏洩時にインポートして公開すると鍵が失効扱いとなる。','$ gpg --gen-revoke -a -o revoke.asc <KeyID>'),
];

// ─────────────────────────────────────────────
// 記述式問題(コマ問)40問
// LPIC本試験では約3-4割が記述式・選択補完式。スペル精度が問われる。
// 形式: { id, obj, prompt, expectedAnswer, alternates, hint, explanation }
// alternates: 別解として受理する文字列の配列(完全一致比較)
// ─────────────────────────────────────────────
const FILL_QUESTIONS = [
  // ── 101.1〜101.3 システム ──
  { id: 'F1', obj: '101.1', prompt: 'カーネルのバージョン文字列(リリース)のみを表示する uname のオプションを記述せよ。',
    expectedAnswer: '-r', alternates: ['--kernel-release'], hint: '-r は release の頭文字',
    explanation: 'uname -r。-a 全情報、-m アーキテクチャ、-n ホスト名、-s カーネル名。' },
  { id: 'F2', obj: '101.1', prompt: '依存関係を解決しながらカーネルモジュールをロードするコマンド名を記述せよ。',
    expectedAnswer: 'modprobe', alternates: [], hint: 'modules.dep を参照する', 
    explanation: 'modprobe は modules.dep を読み依存も自動ロード。insmod は依存解決しない低レベル。' },
  { id: 'F3', obj: '101.2', prompt: '直近のカーネルメッセージ(リングバッファ)を表示するコマンド名を記述せよ。',
    expectedAnswer: 'dmesg', alternates: [], hint: '5文字。systemd 環境では journalctl -k と同等',
    explanation: 'dmesg はカーネルリングバッファ表示。-T で人間可読日時、-l で優先度フィルタ。' },
  { id: 'F4', obj: '101.3', prompt: 'systemd でデフォルトのターゲットを表示するコマンドを完成させよ。「systemctl ____」',
    expectedAnswer: 'get-default', alternates: ['get-default '], hint: 'get-* と set-* のペア',
    explanation: 'systemctl get-default で現在の既定ターゲット表示。set-default で変更。' },
  { id: 'F5', obj: '101.3', prompt: 'systemd でレスキュー(シングルユーザ)モードに切り替えるコマンドを完成させよ。「sudo systemctl ____ rescue.target」',
    expectedAnswer: 'isolate', alternates: [], hint: '一つのターゲットだけを動作中にする',
    explanation: 'systemctl isolate <target> は指定ターゲットに切替え、関連しないサービスを停止する。' },

  // ── 102.1〜102.6 インストール・パッケージ ──
  { id: 'F6', obj: '102.2', prompt: 'GRUB 2 の設定を再生成するコマンドを記述せよ。出力は /boot/grub/grub.cfg とする。',
    expectedAnswer: 'grub-mkconfig -o /boot/grub/grub.cfg', 
    alternates: ['sudo grub-mkconfig -o /boot/grub/grub.cfg', 'grub2-mkconfig -o /boot/grub/grub.cfg'],
    hint: 'mkconfig コマンドを使い、-o で出力先を指定',
    explanation: 'grub-mkconfig -o /boot/grub/grub.cfg。Red Hat 系は grub2-mkconfig。' },
  { id: 'F7', obj: '102.3', prompt: '実行ファイル /usr/bin/ls が依存している共有ライブラリを表示するコマンドを記述せよ。',
    expectedAnswer: 'ldd /usr/bin/ls', alternates: [], hint: '3文字のコマンド + パス',
    explanation: 'ldd は動的リンクされた共有ライブラリと解決先を表示。' },
  { id: 'F8', obj: '102.3', prompt: '共有ライブラリのキャッシュ(/etc/ld.so.cache)を再構築するコマンド名を記述せよ。',
    expectedAnswer: 'ldconfig', alternates: ['sudo ldconfig'], hint: 'ld + 動詞',
    explanation: 'ldconfig は /etc/ld.so.conf と .d/ 配下を走査してキャッシュ更新。' },
  { id: 'F9', obj: '102.4', prompt: 'Debian 系で「nginx パッケージを設定ファイルごと完全削除する」コマンドを完成させよ。「sudo apt ____ nginx」',
    expectedAnswer: 'purge', alternates: [], hint: 'remove だと設定が残る',
    explanation: 'apt purge は設定ファイル(/etc 配下等)も含めて完全削除。remove はバイナリのみ。' },
  { id: 'F10', obj: '102.4', prompt: '/usr/bin/ls を所有しているパッケージを dpkg で検索するオプションを記述せよ。「dpkg ____ /usr/bin/ls」',
    expectedAnswer: '-S', alternates: ['--search'], hint: '-S は Search の S。大文字',
    explanation: 'dpkg -S <ファイル> で所有パッケージを検索。-l は一覧、-L は内容、-S は所有検索。' },
  { id: 'F11', obj: '102.5', prompt: '/usr/bin/ls を所有しているパッケージを rpm で問い合わせるオプションを記述せよ。「rpm ____ /usr/bin/ls」',
    expectedAnswer: '-qf', alternates: ['-qf '], hint: 'q=query, f=file',
    explanation: 'rpm -qf <ファイル> で所有パッケージ。-qa 全一覧、-ql 内容、-qi 詳細。' },
  { id: 'F12', obj: '102.5', prompt: 'RPM パッケージ pkg.rpm を CPIO 形式に変換して標準出力するコマンド名を記述せよ。',
    expectedAnswer: 'rpm2cpio', alternates: [], hint: '名前そのまま',
    explanation: 'rpm2cpio pkg.rpm | cpio -idmv で展開。インストールせず内容を確認できる。' },

  // ── 103.x コマンド ──
  { id: 'F13', obj: '103.2', prompt: 'ファイル /etc/passwd の先頭5行のみを表示するコマンドを記述せよ。',
    expectedAnswer: 'head -n 5 /etc/passwd', alternates: ['head -5 /etc/passwd'], hint: '-n または -N',
    explanation: 'head -n 5 または head -5。デフォルトは10行。tail は末尾。' },
  { id: 'F14', obj: '103.2', prompt: '/etc/passwd から「:」区切りの1列目(ユーザ名)だけを抽出するコマンドを完成させよ。「cut ____ -f1 /etc/passwd」',
    expectedAnswer: '-d:', alternates: ["-d':'", '-d ":"', '-d ":" '], hint: 'デリミタ指定オプション',
    explanation: "cut -d ':' -f 1 で : 区切り1列目。-c で文字位置抽出も可能。" },
  { id: 'F15', obj: '103.3', prompt: 'ディレクトリ src を属性保持で再帰的にコピーする最も推奨されるオプションを記述せよ。「cp ____ src/ dst/」',
    expectedAnswer: '-a', alternates: ['--archive'], hint: '-r でも可だが、属性も保持する推奨形式は別の1文字',
    explanation: '-a (archive) は -r + 属性保持 + symlink 維持。-r/-R は単純な再帰。' },
  { id: 'F16', obj: '103.3', prompt: '存在しない親ディレクトリも含めて /opt/app/logs を作成するコマンドを完成させよ。「mkdir ____ /opt/app/logs」',
    expectedAnswer: '-p', alternates: ['--parents'], hint: '親も作る',
    explanation: 'mkdir -p で親ディレクトリも作成。既存でもエラーにしない。' },
  { id: 'F17', obj: '103.3', prompt: 'カレントディレクトリ以下の24時間以内に変更されたファイルを find で検索するコマンドを完成させよ。「find . -mtime ____」',
    expectedAnswer: '-1', alternates: [], hint: '+ と - で意味が変わる',
    explanation: '-mtime -1 は1日(24時間)未満。+1 は1日より前、1 はちょうど1日前。' },
  { id: 'F18', obj: '103.3', prompt: 'カレントディレクトリの src/ を gzip 圧縮した tar アーカイブ out.tar.gz として作成するコマンドを記述せよ。',
    expectedAnswer: 'tar czf out.tar.gz src/', 
    alternates: ['tar -czf out.tar.gz src/', 'tar czvf out.tar.gz src/', 'tar -czvf out.tar.gz src/'],
    hint: 'c=create, z=gzip, f=ファイル', 
    explanation: 'tar czf <出力> <入力>。展開は xzf、一覧は tzf。bzip2 は j、xz は J。' },
  { id: 'F19', obj: '103.4', prompt: '標準エラー出力(2)を標準出力(1)にマージし、ファイル log にまとめてリダイレクトする末尾の記法を記述せよ。「make > log ____」',
    expectedAnswer: '2>&1', alternates: [], hint: 'fd 2 を fd 1 へ',
    explanation: '"> log 2>&1" の順序が重要。bash 略記の &> log でも同じ。' },
  { id: 'F20', obj: '103.4', prompt: '標準入力をファイル out.txt に書きながら標準出力にも流すコマンド名を記述せよ。',
    expectedAnswer: 'tee', alternates: [], hint: 'T字に分岐、3文字',
    explanation: 'tee は出力を分岐。-a で追記。"| sudo tee" は権限のあるファイルへの書込定番。' },
  { id: 'F21', obj: '103.5', prompt: 'PID 12345 のプロセスを強制終了する(SIGKILL を送る)コマンドを記述せよ。',
    expectedAnswer: 'kill -9 12345', alternates: ['kill -SIGKILL 12345', 'kill -KILL 12345', 'sudo kill -9 12345'],
    hint: 'シグナル9を指定', explanation: 'SIGKILL(9)は捕捉不可の強制終了。通常は SIGTERM(15)を先に試す。' },
  { id: 'F22', obj: '103.5', prompt: 'ターミナル切断後もプロセスを継続させて ./long.sh をバックグラウンド実行するコマンドを記述せよ。',
    expectedAnswer: 'nohup ./long.sh &', alternates: ['nohup ./long.sh > nohup.out 2>&1 &', 'nohup ./long.sh &amp;'],
    hint: 'SIGHUP を無視させる + & でBG',
    explanation: 'nohup はSIGHUP を無視させる。出力は nohup.out へ。screen/tmux は対話的再接続も可能。' },
  { id: 'F23', obj: '103.6', prompt: 'PID 1234 のプロセスの nice 値を 10 に変更するコマンドを記述せよ。',
    expectedAnswer: 'renice -n 10 -p 1234', alternates: ['renice 10 -p 1234', 'sudo renice -n 10 -p 1234', 'renice -n 10 1234', 'sudo renice -n 10 1234'],
    hint: 'renice + -n 値 + -p PID', explanation: 'renice -n <nice値> -p <PID>。-u ユーザ、-g グループ。' },
  { id: 'F24', obj: '103.7', prompt: 'log.txt から "error" または "warn" を含む行を ERE で検索するコマンドを記述せよ(grep を使うこと)。',
    expectedAnswer: 'grep -E "error|warn" log.txt',
    alternates: ['grep -E \'error|warn\' log.txt', 'egrep "error|warn" log.txt', "egrep 'error|warn' log.txt"],
    hint: '-E または egrep で拡張正規表現',
    explanation: '-E で ERE、または egrep。BRE では \\| になる。' },
  { id: 'F25', obj: '103.7', prompt: "file.txt 中の 'old' を 'new' に行内全置換し、ファイルを直接書き換えるコマンドを記述せよ。",
    expectedAnswer: "sed -i 's/old/new/g' file.txt",
    alternates: ['sed -i "s/old/new/g" file.txt', "sed -i -e 's/old/new/g' file.txt"],
    hint: '-i 直接書換、s/.../.../g 全置換', explanation: 'sed -i で直接書換。g なしは行内最初のみ置換。' },

  // ── 104.x ファイルシステム ──
  { id: 'F26', obj: '104.1', prompt: '/dev/sdb1 に ext4 ファイルシステムを作成するコマンドを記述せよ。',
    expectedAnswer: 'mkfs.ext4 /dev/sdb1',
    alternates: ['sudo mkfs.ext4 /dev/sdb1', 'mkfs -t ext4 /dev/sdb1', 'sudo mkfs -t ext4 /dev/sdb1'],
    hint: 'mkfs.<種別> または mkfs -t <種別>',
    explanation: 'mkfs.ext4 または mkfs -t ext4。XFS は mkfs.xfs、Btrfs は mkfs.btrfs。' },
  { id: 'F27', obj: '104.2', prompt: '/dev/sdb1 のファイルシステム整合性をチェック・修復(自動 yes)するコマンドを記述せよ。',
    expectedAnswer: 'fsck -y /dev/sdb1', alternates: ['sudo fsck -y /dev/sdb1', 'fsck.ext4 -y /dev/sdb1'],
    hint: '-y で全質問に yes', explanation: 'fsck はフロントエンド。アンマウント済みで実行。-y 自動 yes、-N ドライラン。' },
  { id: 'F28', obj: '104.3', prompt: 'デバイス /dev/sda1 の UUID を確認するコマンドを記述せよ。',
    expectedAnswer: 'blkid /dev/sda1', alternates: ['sudo blkid /dev/sda1', 'blkid'],
    hint: 'block id を取得', explanation: 'blkid は UUID/LABEL/TYPE を表示。引数なしで全デバイス、引数指定で個別。' },
  { id: 'F29', obj: '104.5', prompt: 'umask の値が 027 のとき、新規作成される一般ファイルのパーミッションを8進数3桁で記述せよ。',
    expectedAnswer: '640', alternates: ['0640'], hint: '666 から umask を引く',
    explanation: '666 - 027 = 640 (rw-r-----)。ディレクトリは 777 - 027 = 750。' },
  { id: 'F30', obj: '104.5', prompt: 'スティッキービット付きで chmod を数値表記する場合の先頭1桁の値を記述せよ。',
    expectedAnswer: '1', alternates: [], hint: '4=SUID, 2=SGID, 1=?',
    explanation: '1xxx スティッキー、2xxx SGID、4xxx SUID。1755 など。' },
  { id: 'F31', obj: '104.6', prompt: '/usr/local/bin/python から /usr/bin/python3 へのシンボリックリンクを作成するコマンドを記述せよ。',
    expectedAnswer: 'ln -s /usr/bin/python3 /usr/local/bin/python',
    alternates: ['sudo ln -s /usr/bin/python3 /usr/local/bin/python', 'ln --symbolic /usr/bin/python3 /usr/local/bin/python'],
    hint: 'ln -s ターゲット リンク名', explanation: 'ln -s <target> <link>。-s なしはハードリンク。' },

  // ── 105.x シェル ──
  { id: 'F32', obj: '105.2', prompt: 'シェルスクリプトに渡された引数の個数を表す変数(記号)を記述せよ。',
    expectedAnswer: '$#', alternates: ['"$#"'], hint: '個数、シャープ',
    explanation: '$# 個数、$0 名前、$1〜$9 各引数、$@ 全引数、$? 直前ステータス、$$ 自PID、$! 直前BG PID。' },
  { id: 'F33', obj: '105.2', prompt: 'シェルスクリプトを実行行のトレース付きで起動するコマンドを完成させよ。「bash ____ script.sh」',
    expectedAnswer: '-x', alternates: ['-xv'], hint: 'execute trace',
    explanation: 'bash -x で実行行を「+」付きで表示。スクリプト内 set -x / set +x で部分指定可。' },

  // ── 107.x 管理 ──
  { id: 'F34', obj: '107.1', prompt: 'ホームディレクトリ作成付きでユーザ alice を /bin/bash シェルで追加するコマンドを記述せよ。',
    expectedAnswer: 'useradd -m -s /bin/bash alice',
    alternates: ['sudo useradd -m -s /bin/bash alice', 'useradd -s /bin/bash -m alice', 'sudo useradd -s /bin/bash -m alice'],
    hint: '-m ホーム、-s シェル', explanation: '-m はホーム作成(/etc/skel から複製)、-s でログインシェル指定。' },
  { id: 'F35', obj: '107.1', prompt: '既存ユーザ alice を docker グループに「補助グループとして追加」するコマンドを記述せよ。',
    expectedAnswer: 'usermod -aG docker alice', alternates: ['sudo usermod -aG docker alice', 'usermod -a -G docker alice', 'sudo usermod -a -G docker alice'],
    hint: '-aG が必須(-a を忘れると外れる)',
    explanation: 'usermod -aG <group> <user>。-a を忘れると既存補助グループから外れる致命的ミス。' },
  { id: 'F36', obj: '107.2', prompt: '「毎日午前3時に /backup.sh を実行する」cron エントリを記述せよ(コマンド込みで一行)。',
    expectedAnswer: '0 3 * * * /backup.sh', alternates: ['0 3 * * * /backup.sh ', '0  3  *  *  * /backup.sh'],
    hint: '分 時 日 月 曜日 コマンド',
    explanation: '分=0, 時=3, 日=*, 月=*, 曜日=*, コマンド=/backup.sh。曜日は 0/7=日, 1=月。' },

  // ── 108.x サービス ──
  { id: 'F37', obj: '108.1', prompt: 'タイムゾーンを Asia/Tokyo に永続的に変更するコマンドを記述せよ。',
    expectedAnswer: 'timedatectl set-timezone Asia/Tokyo',
    alternates: ['sudo timedatectl set-timezone Asia/Tokyo'],
    hint: 'timedatectl の set-* サブコマンド',
    explanation: 'timedatectl set-timezone は内部的に /etc/localtime のシンボリックリンクを更新。' },
  { id: 'F38', obj: '108.2', prompt: 'systemd journal で「直近1時間以内」のログを表示するオプションを記述せよ。「journalctl ____ "1 hour ago"」',
    expectedAnswer: '--since', alternates: ['-S'],
    hint: '時刻範囲指定', explanation: '--since と --until で時刻範囲指定。"yesterday" "1 hour ago" "2026-05-01 10:00" 等。' },

  // ── 109.x ネットワーク ──
  { id: 'F39', obj: '109.3', prompt: 'TCP のリッスン中ポートとプロセスを表示する ss コマンドのオプション組合せを記述せよ。「sudo ss ____」',
    expectedAnswer: '-tlnp', alternates: ['-tlpn', '-ltnp', '-ltpn', '-pltn', '-plnt', '-pntl', '-ptln', '-tnlp', '-tnpl', '-nltp', '-nlpt', '-nplt', '-ntlp', '-nptl', '-lntp', '-lnpt', '-lpnt', '-lptn', '-tpln', '-tpnl', '-pnlt', '-ptnl'],
    hint: '-t TCP, -l LISTEN, -n 数値, -p プロセス',
    explanation: 'ss -tlnp。-t TCP、-u UDP、-l LISTEN、-n 数値、-p プロセス、-a 全状態。' },

  // ── 110.x セキュリティ ──
  { id: 'F40', obj: '110.3', prompt: 'ed25519 アルゴリズムで SSH 鍵ペアを生成するコマンドを完成させよ。「ssh-keygen ____ ed25519」',
    expectedAnswer: '-t', alternates: ['-t '], hint: 'type の頭文字',
    explanation: 'ssh-keygen -t ed25519。-b ビット長、-f 出力先、-C コメント。秘密鍵は 600 必須。' },
];


// ─────────────────────────────────────────────
// 28日カリキュラム (LPIC v5・あずき本準拠)
// ─────────────────────────────────────────────
const WEEKS = [
  { num: 1, title: '101試験 前半', subtitle: 'システム基盤・パッケージ管理' },
  { num: 2, title: '101試験 後半', subtitle: 'コマンド・ファイルシステム' },
  { num: 3, title: '102試験 前半', subtitle: 'シェル・UI・管理業務' },
  { num: 4, title: '102試験 後半', subtitle: 'サービス・ネットワーク・セキュリティ' },
];

const CURRICULUM = [
  // ── Week 1: 101前半 ──
  { day: 1, week: 1, exam: '101', objIds: ['101.1'], title: 'ハードウェアの基礎', goal: 'Linuxがハードウェアをどう認識・管理するかを掴む。',
    concepts: [
      { term: 'lspci / lsusb', desc: 'PCI/USB デバイス列挙。lscpu はCPU、lsblk はブロックデバイス。' },
      { term: '/proc と /sys', desc: 'カーネル情報の仮想FS。/proc/cpuinfo, /proc/meminfo 等。' },
      { term: 'udev', desc: 'デバイスのホットプラグを検知し /dev に動的作成。/etc/udev/rules.d/。' },
      { term: 'modprobe / lsmod', desc: 'カーネルモジュールのロード/一覧。insmod は依存解決しない低レベル。' },
    ],
    commands: [
      { cmd: 'lspci | grep -i ethernet', desc: 'PCIデバイス確認' },
      { cmd: 'lsmod | head', desc: 'ロード済みモジュール' },
      { cmd: 'sudo modprobe e1000e', desc: 'モジュールロード' },
    ],
    questionIds: [1, 2, 3, 4, 5] },
  { day: 2, week: 1, exam: '101', objIds: ['101.2'], title: 'システム起動シーケンス', goal: 'BIOS/UEFI から init/systemd までの流れを暗唱できる状態に。',
    concepts: [
      { term: '起動順序', desc: 'Power → BIOS/UEFI → bootloader (GRUB) → kernel → initramfs → init/systemd → サービス。' },
      { term: 'BIOS と UEFI', desc: 'UEFI は新規格で GPT と組合わせ。/sys/firmware/efi の有無で判別。' },
      { term: 'initramfs', desc: '一時ルートFS。必要ドライバを読み、本来のルートFSへ pivot_root。' },
      { term: 'dmesg / journalctl -k', desc: 'カーネルメッセージ確認。-T で人間可読日時。' },
    ],
    commands: [
      { cmd: 'dmesg -T | tail -20', desc: 'カーネルログ' },
      { cmd: 'journalctl -b -k', desc: '今回のブート以降' },
    ],
    questionIds: [6, 7, 8, 9] },
  { day: 3, week: 1, exam: '101', objIds: ['101.3'], title: 'ランレベル・systemdターゲット', goal: 'SysVinitとsystemd両方の概念で動作モードを切替えられる。',
    concepts: [
      { term: 'SysVinit ランレベル', desc: '0=停止、1=シングル、2-3=マルチ、5=GUI、6=再起動。' },
      { term: 'systemd target', desc: 'rescue=旧1、multi-user=旧3、graphical=旧5。' },
      { term: 'systemctl', desc: 'start/stop/restart/status/enable/disable/mask/isolate。' },
      { term: 'shutdown / wall', desc: 'shutdown -h/-r [時刻]。wall で全端末通知。' },
    ],
    commands: [
      { cmd: 'systemctl get-default', desc: '既定ターゲット' },
      { cmd: 'sudo systemctl isolate rescue.target', desc: 'レスキュー' },
      { cmd: 'sudo shutdown -r +5', desc: '5分後再起動' },
    ],
    questionIds: [10, 11, 12, 13, 14, 15, 16] },
  { day: 4, week: 1, exam: '101', objIds: ['102.1', '102.2'], title: 'ディスク設計とブートマネージャ', goal: 'パーティション設計とGRUBの役割を理解する。',
    concepts: [
      { term: 'パーティション戦略', desc: '/, /home, /var, /boot を分ける慣行。' },
      { term: 'ESP', desc: 'EFI System Partition は VFAT。/boot/efi にマウント。' },
      { term: 'LVM', desc: 'PV→VG→LV の階層。動的拡張・スナップショット。' },
      { term: 'GRUB 2', desc: '/etc/default/grub と /etc/grub.d/ → grub-mkconfig。' },
      { term: 'GRUB Legacy', desc: '旧版。/boot/grub/menu.lst を直接編集。' },
    ],
    commands: [
      { cmd: 'sudo grub-install /dev/sda', desc: 'MBRにインストール' },
      { cmd: 'sudo grub-mkconfig -o /boot/grub/grub.cfg', desc: '設定再生成' },
    ],
    questionIds: [17, 18, 19, 20, 21, 22, 23, 24, 25] },
  { day: 5, week: 1, exam: '101', objIds: ['102.3'], title: '共有ライブラリの管理', goal: 'ldd・ldconfig・LD_LIBRARY_PATH の三点を完全理解。',
    concepts: [
      { term: 'ldd', desc: '実行ファイルが依存する共有ライブラリと解決先を表示。' },
      { term: 'ldconfig', desc: '/etc/ld.so.conf 等を走査して /etc/ld.so.cache 再構築。' },
      { term: 'LD_LIBRARY_PATH', desc: ': 区切りで追加検索パス。本番では ldconfig 経由が推奨。' },
    ],
    commands: [
      { cmd: 'ldd /usr/bin/ls', desc: '依存ライブラリ' },
      { cmd: 'sudo ldconfig', desc: 'キャッシュ更新' },
    ],
    questionIds: [26, 27, 28] },
  { day: 6, week: 1, exam: '101', objIds: ['102.4'], title: 'Debian系パッケージ管理', goal: 'apt と dpkg の役割分担を反射的に出せる。',
    concepts: [
      { term: 'apt', desc: '高レベル依存解決。update→upgrade、search、show、purge、autoremove。' },
      { term: 'dpkg', desc: '低レベル。-i 導入、-l 一覧、-L 内容、-S ファイル検索、-r 削除、-P 完全削除。' },
      { term: 'apt-cache', desc: 'ローカル索引検索。search、show、policy。' },
      { term: 'dpkg-reconfigure', desc: '対話的に設定再実行。tzdata、locales 等で頻繁。' },
    ],
    commands: [
      { cmd: 'sudo apt update && sudo apt upgrade', desc: '索引→実体更新' },
      { cmd: 'apt-cache search "image viewer"', desc: '名称検索' },
      { cmd: 'sudo apt purge nginx', desc: '設定込み削除' },
    ],
    questionIds: [29, 30, 31, 32, 33, 34] },
  { day: 7, week: 1, exam: '101', objIds: ['102.5', '102.6'], title: 'RPM系パッケージ管理と仮想化', goal: 'rpm/dnf/yum/zypperを使い分け、仮想化の概要を掴む。',
    concepts: [
      { term: 'rpm の問い合わせ', desc: '-qa 全一覧、-qf ファイル所有、-ql 内容、-qi 詳細、-V 整合性検証。' },
      { term: 'dnf / yum', desc: '依存解決の高レベル。リポジトリは /etc/yum.repos.d/。' },
      { term: 'zypper', desc: 'SUSE 系の高レベル。in/rm/up/se 等の短縮形。' },
      { term: 'rpm2cpio', desc: 'インストールせず中身だけ展開。' },
      { term: '仮想化とコンテナ', desc: 'VM=独立カーネル、コンテナ=ホストカーネル共有。cloud-init で初期化。' },
    ],
    commands: [
      { cmd: 'rpm -qf /usr/bin/ls', desc: 'ファイル所有パッケージ' },
      { cmd: 'sudo dnf install httpd', desc: '依存込み導入' },
    ],
    questionIds: [35, 36, 37, 38, 39, 40, 41] },

  // ── Week 2: 101後半 ──
  { day: 8, week: 2, exam: '101', objIds: ['103.1'], title: 'コマンドラインの基礎', goal: 'bash の対話操作・履歴・変数・man を自在に扱う。',
    concepts: [
      { term: 'シェル変数 vs 環境変数', desc: 'export で環境変数化(子プロセス継承)。' },
      { term: 'クォート', desc: "シングル=展開なし、ダブル=$と$()展開、バッククォート=コマンド置換(古典)。" },
      { term: 'history と !', desc: '!! 直前、!N 番号、!str 接頭辞検索、Ctrl+R 検索。' },
      { term: 'man', desc: '章番号: 1=ユーザ、2=syscall、3=lib、5=設定、8=管理者。' },
    ],
    commands: [
      { cmd: 'history | tail -5', desc: '直近履歴' },
      { cmd: 'man 5 fstab', desc: '設定ファイル書式' },
    ],
    questionIds: [42, 43, 44, 45, 46, 47] },
  { day: 9, week: 2, exam: '101', objIds: ['103.2'], title: 'テキストフィルタ', goal: 'cat/cut/sort/uniq/wc/tr 等を自在に組合わせる。',
    concepts: [
      { term: 'head / tail / less', desc: '先頭・末尾・双方向ページャ。tail -f で追記監視。' },
      { term: 'cut -d -f', desc: 'デリミタ区切りで列抽出。-c で文字位置抽出。' },
      { term: 'sort と uniq', desc: 'sort -n 数値、-r 逆順、-k 列。uniq -c 出現回数(事前 sort)。' },
      { term: 'tr', desc: 'tr a-z A-Z で大小変換、-d 削除、-s 連続圧縮。' },
    ],
    commands: [
      { cmd: 'cut -d: -f1 /etc/passwd', desc: 'ユーザ名抽出' },
      { cmd: "awk '{print $1}' log | sort | uniq -c | sort -rn", desc: 'IP別アクセス数' },
    ],
    questionIds: [48, 49, 50, 51, 52, 53, 54, 55] },
  { day: 10, week: 2, exam: '101', objIds: ['103.3'], title: '基本ファイル管理 + アーカイブ', goal: 'cp/mv/rm/find/tar を本能的に書ける。',
    concepts: [
      { term: 'cp -a / cp -r', desc: '-a は属性保持で再帰(推奨)。' },
      { term: 'find', desc: '-name, -mtime, -type, -size, -exec {} \\;。-print0 と xargs -0。' },
      { term: 'ワイルドカード', desc: '* 0文字以上、? 1文字、[a-c] 文字クラス。' },
      { term: 'tar', desc: 'c=create, x=extract, t=list, z=gzip, j=bzip2, J=xz。' },
      { term: 'dd', desc: '低水準コピー。誤操作で全データ喪失するため慎重に。' },
    ],
    commands: [
      { cmd: 'cp -a src/ dst/', desc: '属性保持で再帰コピー' },
      { cmd: 'find . -mtime -1 -name "*.log"', desc: '24時間以内のログ' },
      { cmd: 'tar czf out.tar.gz src/', desc: 'gzip圧縮' },
    ],
    questionIds: [56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66] },
  { day: 11, week: 2, exam: '101', objIds: ['103.4'], title: 'ストリーム・パイプ・リダイレクト', goal: '>, >>, 2>&1, |, tee, xargs を呼吸のように使える。',
    concepts: [
      { term: 'リダイレクト基本', desc: '> 上書き、>> 追記、< 入力、| パイプ、2> 標準エラー。' },
      { term: '2>&1', desc: 'fd 2 を fd 1 にリダイレクト。順序が大切。' },
      { term: 'tee', desc: 'T字分岐: 標準出力に流しつつファイルにも書く。-a 追記。' },
      { term: 'xargs', desc: '標準入力を引数列に変換。-I {} 位置指定、-0 NULL区切り。' },
    ],
    commands: [
      { cmd: 'make > build.log 2>&1', desc: 'まとめて記録' },
      { cmd: 'find . -name "*.tmp" -print0 | xargs -0 rm', desc: '安全な一括削除' },
    ],
    questionIds: [67, 68, 69, 70] },
  { day: 12, week: 2, exam: '101', objIds: ['103.5', '103.6'], title: 'プロセスと優先度', goal: 'ps/top/kill/jobs と nice/renice を一連で操れる。',
    concepts: [
      { term: 'ps aux / ps -ef', desc: 'スナップショット表示。grep と組合わせる定番。' },
      { term: 'top / pstree / pgrep', desc: 'リアルタイム / 木構造 / 名前→PID。' },
      { term: 'kill / killall / pkill', desc: 'SIGTERM(15)→SIGKILL(9)の順で。' },
      { term: 'ジョブ制御', desc: '& BG、Ctrl+Z 停止、jobs、fg %1、bg、nohup。' },
      { term: 'nice/renice', desc: 'nice 値 -20〜19。負値は root のみ。' },
    ],
    commands: [
      { cmd: 'ps aux | grep nginx', desc: '名称検索' },
      { cmd: 'pgrep -lu alice', desc: 'aliceの全PID' },
      { cmd: 'sudo renice -n 5 -p 12345', desc: '実行中変更' },
    ],
    questionIds: [71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82] },
  { day: 13, week: 2, exam: '101', objIds: ['103.7', '103.8'], title: '正規表現と vi', goal: 'grep/sed の正規表現と vi の基本操作を確実に使える。',
    concepts: [
      { term: 'BRE vs ERE', desc: 'grep は BRE、grep -E (egrep) は ERE。' },
      { term: 'メタ文字', desc: '^ 行頭、$ 行末、. 任意1字、* 0以上、[abc] クラス。' },
      { term: 'sed s/old/new/g', desc: '行内全置換は g。-i でファイル直接書換。' },
      { term: 'vi モード', desc: 'コマンド←ESC→入力(i a o)、:wq 保存、dd yy p。' },
    ],
    commands: [
      { cmd: 'grep -nE "^ERROR|WARN" log.txt', desc: 'EREで行頭マッチ' },
      { cmd: "sed -i 's/foo/bar/g' file.txt", desc: '直接書換' },
    ],
    questionIds: [83, 84, 85, 86, 87, 88, 89, 90, 91] },
  { day: 14, week: 2, exam: '101', objIds: ['104.1', '104.2', '104.3', '104.5', '104.6', '104.7'], title: 'デバイス・FS・FHS 総攻略', goal: 'パーティション作成からマウント・パーミッション・FHS まで一気に固める。',
    concepts: [
      { term: 'パーティション', desc: 'fdisk(MBR)、gdisk(GPT)、parted(両対応)。LVM。' },
      { term: 'mkfs.<種別>', desc: 'ext4 / xfs / vfat / btrfs。スワップは mkswap → swapon。' },
      { term: 'fsck と tune2fs', desc: 'fsck 整合性検査、xfs_repair (XFS)。tune2fs 調整。' },
      { term: '/etc/fstab', desc: 'device mountpoint type options dump pass。UUID 推奨。' },
      { term: 'パーミッション', desc: '755=rwxr-xr-x。SUID 4xxx、SGID 2xxx、sticky 1xxx。' },
      { term: 'リンク', desc: 'ハード=同inode、symbolic=別inodeでパス保持。' },
      { term: 'find / locate / which', desc: 'find リアルタイム、locate 索引、which/type/whereis。' },
    ],
    commands: [
      { cmd: 'sudo mkfs.ext4 /dev/sdb1', desc: 'フォーマット' },
      { cmd: 'sudo blkid /dev/sdb1', desc: 'UUID確認' },
      { cmd: 'find / -perm -4000 2>/dev/null', desc: 'SUID監査' },
    ],
    questionIds: [92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118],
    isReview: true },

  // ── Week 3: 102前半 ──
  { day: 15, week: 3, exam: '102', objIds: ['105.1'], title: 'シェル環境のカスタマイズ', goal: 'bash 起動ファイルの違いと alias/function を体得する。',
    concepts: [
      { term: 'ログインシェル', desc: '~/.bash_profile → ~/.bash_login → ~/.profile を順に検索し最初の1つ。' },
      { term: '対話的非ログイン', desc: '~/.bashrc を読む。通常 .bash_profile から source。' },
      { term: 'システム全体', desc: '/etc/profile、/etc/bash.bashrc(ディストロ依存)。' },
      { term: 'source / .', desc: '現在のシェルで実行(変数を継承)。bash や ./ では子プロセス。' },
    ],
    commands: [
      { cmd: "echo \"alias ll='ls -la'\" >> ~/.bashrc", desc: 'alias永続化' },
      { cmd: 'source ~/.bashrc', desc: '反映' },
    ],
    questionIds: [119, 120, 121, 122, 123] },
  { day: 16, week: 3, exam: '102', objIds: ['105.2'], title: 'シェルスクリプト', goal: '位置パラメータ・条件分岐・ループ・関数を自然に書ける。',
    concepts: [
      { term: 'シバン', desc: '#!/bin/bash または #!/usr/bin/env bash。実行ビット必要。' },
      { term: '位置パラメータ', desc: '$0 名前、$1〜$9 引数、$# 個数、$@ 全引数、shift でずらす。' },
      { term: '終了ステータス', desc: '$? 直前ステータス、exit N、||/&& による連鎖。' },
      { term: '制御構造', desc: 'if〜fi、case〜esac、for/while〜done。test または [ … ]。' },
      { term: 'コマンド置換', desc: '$(cmd) 推奨、`cmd` 古典。read で標準入力取得。' },
      { term: 'デバッグ', desc: 'bash -x または set -x でトレース。' },
    ],
    commands: [
      { cmd: 'bash -x script.sh', desc: 'トレース実行' },
      { cmd: 'NOW=$(date +%F)', desc: 'コマンド置換' },
    ],
    questionIds: [124, 125, 126, 127, 128, 129, 130, 131, 132, 133] },
  { day: 17, week: 3, exam: '102', objIds: ['106.1', '106.2', '106.3'], title: 'X11・デスクトップ・アクセシビリティ', goal: 'X11のアーキテクチャと主要DE、支援技術を識別できる。',
    concepts: [
      { term: 'Xクライアント・サーバ', desc: 'サーバが画面と入力、クライアントがアプリ。DISPLAY 環境変数。' },
      { term: 'xhost と xauth', desc: 'xhost=ホスト単位、xauth=鍵ベース(より安全)。' },
      { term: 'Wayland', desc: 'X11 の後継プロトコル。XWayland で互換層。' },
      { term: '主要 DE', desc: 'GNOME、KDE Plasma、Xfce、MATE、Cinnamon。' },
      { term: 'アクセシビリティ', desc: 'Screen Reader (Orca)、Magnifier、Sticky/Slow/Bounce Keys 等。' },
      { term: 'リモートデスクトップ', desc: 'VNC、XDMCP、RDP(xrdp)、Spice。' },
    ],
    commands: [
      { cmd: 'echo $DISPLAY', desc: '表示先' },
      { cmd: 'xhost +localhost', desc: 'ローカル許可' },
    ],
    questionIds: [134, 135, 136, 137, 138, 139, 140, 141, 142] },
  { day: 18, week: 3, exam: '102', objIds: ['107.1'], title: 'ユーザ・グループ管理 (重要度5)', goal: 'useradd〜usermod〜passwd〜chage の流れを完璧に。',
    concepts: [
      { term: '/etc/passwd の7欄', desc: 'name:passwd:UID:GID:GECOS:home:shell。' },
      { term: '/etc/shadow', desc: 'パスワードハッシュ・最終変更日・最大有効日数等。rootのみ読取可。' },
      { term: 'useradd オプション', desc: '-m ホーム作成、-s シェル、-c コメント、-G 補助グループ、-u UID。' },
      { term: 'usermod -aG', desc: '-a を忘れると既存補助グループから外れる致命的ミス。' },
      { term: 'chage', desc: '-l 表示、-M 最大日数、-W 警告、-E 失効日、-d 最終変更日。' },
      { term: 'getent', desc: 'NSS 経由でユーザ・グループ・ホスト等を取得。' },
    ],
    commands: [
      { cmd: 'sudo useradd -m -s /bin/bash -G sudo,docker alice', desc: 'ユーザ追加' },
      { cmd: 'sudo usermod -aG dev alice', desc: '補助グループ追加' },
      { cmd: 'sudo chage -l alice', desc: '有効期限確認' },
    ],
    questionIds: [143, 144, 145, 146, 147, 148, 149, 150] },
  { day: 19, week: 3, exam: '102', objIds: ['107.2'], title: 'ジョブスケジューリング', goal: 'cron / at / systemd timer を場面ごとに使い分けられる。',
    concepts: [
      { term: 'cron 書式', desc: '分(0-59) 時(0-23) 日(1-31) 月(1-12) 曜日(0-7、0/7=日)。' },
      { term: 'crontab', desc: '-e 編集、-l 表示、-r 削除。実体は /var/spool/cron/。' },
      { term: 'システム cron', desc: '/etc/crontab、/etc/cron.{daily,hourly,weekly,monthly}/。' },
      { term: 'at', desc: '一度きり指定時刻実行。atq 一覧、atrm 取消。' },
      { term: 'systemd timer', desc: '.timer ユニットと対応 .service の組。systemctl list-timers。' },
      { term: 'アクセス制御', desc: '/etc/cron.allow と /etc/cron.deny。allow が優先。' },
    ],
    commands: [
      { cmd: 'crontab -e', desc: '個人 cron 編集' },
      { cmd: 'echo "/path/cmd" | at 23:00', desc: '一回限りジョブ' },
    ],
    questionIds: [151, 152, 153, 154, 155] },
  { day: 20, week: 3, exam: '102', objIds: ['107.3'], title: 'ローカライゼーションと国際化', goal: 'LANG/LC_*/TZ・iconv・timedatectl を扱える。',
    concepts: [
      { term: 'ロケール優先順位', desc: 'LC_ALL > LC_* > LANG。' },
      { term: 'タイムゾーン', desc: '/etc/localtime(/usr/share/zoneinfo/への symlink)。' },
      { term: 'timedatectl', desc: 'set-timezone, set-time, set-ntp。status で現状。' },
      { term: 'iconv', desc: '-f 元 -t 先 でエンコード変換。' },
      { term: '主要ロケール', desc: 'C/POSIX、en_US.UTF-8、ja_JP.UTF-8。' },
    ],
    commands: [
      { cmd: 'LANG=C date', desc: '英語表記で日付' },
      { cmd: 'sudo timedatectl set-timezone Asia/Tokyo', desc: 'TZ変更' },
    ],
    questionIds: [156, 157, 158, 159] },
  { day: 21, week: 3, exam: '102', objIds: ['105.1', '105.2', '107.1', '107.2', '107.3'], title: '第3週 総復習', goal: 'シェル+管理業務の全範囲を通しで確認。',
    concepts: [
      { term: '今週の重点', desc: 'シェル起動ファイル、スクリプト構文、useradd/usermod、cron/at/timer、ロケール・TZ。' },
      { term: '苦手の自覚', desc: '誤答は3日以内に再演習を。理由を声に出して説明できれば理解定着。' },
    ],
    commands: [
      { cmd: '# 鍵', desc: 'export, $#, fi, esac, useradd -m, usermod -aG, crontab -e, LANG=C' },
    ],
    questionIds: [120, 124, 127, 130, 144, 145, 152, 156], isReview: true },

  // ── Week 4: 102後半 ──
  { day: 22, week: 4, exam: '102', objIds: ['108.1', '108.2'], title: '時刻管理とログ', goal: 'timedatectl/chronyd/rsyslog/journalctl/logrotate を一気通貫で扱える。',
    concepts: [
      { term: 'timedatectl', desc: 'systemd 統合の時刻管理。status/set-time/set-timezone/set-ntp。' },
      { term: 'NTP / chrony', desc: 'chronyd は復帰が速くノートPC向き。pool.ntp.org が標準。' },
      { term: 'rsyslog', desc: '<facility>.<priority> <action>。auth/cron/mail/kern 等のファシリティ。' },
      { term: 'journalctl', desc: '-u ユニット、-k カーネル、-f 追従、--since 時刻、-p 優先度、-b ブート単位。' },
      { term: 'logrotate', desc: '/etc/logrotate.conf と /etc/logrotate.d/。daily/weekly、rotate 回数、compress。' },
      { term: 'logger', desc: 'コマンドラインから syslog にログ書込。-t タグ、-p facility.priority。' },
    ],
    commands: [
      { cmd: 'timedatectl status', desc: '時刻状態' },
      { cmd: 'chronyc sources', desc: 'NTPソース' },
      { cmd: 'journalctl --since "1 hour ago" -u nginx', desc: 'ユニット別最近ログ' },
    ],
    questionIds: [160, 161, 162, 163, 164, 165, 166, 167, 168, 169] },
  { day: 23, week: 4, exam: '102', objIds: ['108.3', '108.4'], title: 'MTA と印刷', goal: 'メールエイリアス・転送・MTA識別と CUPS 印刷を扱える。',
    concepts: [
      { term: '主要 MTA', desc: 'postfix、sendmail、exim。' },
      { term: '/etc/aliases', desc: '形式 "alias: target1, target2"。編集後 newaliases で /etc/aliases.db。' },
      { term: '~/.forward', desc: 'ユーザ自身が転送設定。各行に転送先メールアドレス。' },
      { term: 'mailq', desc: '送信待ち・延滞メール一覧。' },
      { term: 'CUPS', desc: '現代標準の印刷システム。Web UI: http://localhost:631/。' },
      { term: 'lpr/lprm/lpq/lpstat', desc: 'ジョブ投入/削除/キュー表示/状態確認。-P でプリンタ指定。' },
    ],
    commands: [
      { cmd: 'sudo newaliases', desc: '/etc/aliases反映' },
      { cmd: 'lpr -P printer1 report.pdf', desc: '印刷投入' },
    ],
    questionIds: [170, 171, 172, 173, 174, 175, 176, 177] },
  { day: 24, week: 4, exam: '102', objIds: ['109.1'], title: 'TCP/IPの基礎', goal: 'IP・サブネット・代表ポート・IPv6 を暗記する。',
    concepts: [
      { term: 'IPv4 アドレス', desc: '32bit。プライベートは 10/8、172.16/12、192.168/16。' },
      { term: 'サブネット', desc: '/24 = 256 アドレス、利用可能ホスト 254。' },
      { term: '代表ポート', desc: '20/21 FTP、22 SSH、25 SMTP、53 DNS、80 HTTP、123 NTP、443 HTTPS。' },
      { term: 'TCP / UDP / ICMP', desc: 'TCP=コネクション指向、UDP=コネクションレス、ICMP=制御メッセージ。' },
      { term: 'IPv6', desc: '128bit。: 区切り 8 ブロック。:: で連続 0 を省略可能。' },
      { term: '/etc/services', desc: 'サービス名→ポート/プロトコルの対応表。' },
    ],
    commands: [
      { cmd: 'ip -br addr', desc: 'IP簡潔表示' },
      { cmd: 'getent services 443', desc: 'ポートからサービス' },
    ],
    questionIds: [178, 179, 180, 181, 182, 183, 184] },
  { day: 25, week: 4, exam: '102', objIds: ['109.2', '109.3'], title: 'ネットワーク設定と問題解決', goal: 'NetworkManager・iproute2・ping/ss/traceroute を運用に使える。',
    concepts: [
      { term: 'NetworkManager / nmcli', desc: 'connection/device/general を CLI で操作。' },
      { term: 'hostnamectl', desc: 'set-hostname で永続。/etc/hostname を更新。' },
      { term: 'iproute2 (ip)', desc: 'addr / link / route / neigh。古典的 ifconfig・route・arp の置換。' },
      { term: 'ss', desc: '-t TCP、-u UDP、-l LISTEN、-n 数値、-p プロセス。' },
      { term: 'ping / traceroute / tracepath', desc: '到達性 / 経路追跡 / 権限不要版。' },
      { term: 'nc (netcat)', desc: '-zv ポート疎通、-l リスナー、-u UDP。' },
    ],
    commands: [
      { cmd: 'sudo ss -tlnp', desc: 'リスニングポート' },
      { cmd: 'nc -zv example.com 443', desc: 'ポート疎通' },
    ],
    questionIds: [185, 186, 187, 188, 189, 190, 191, 192, 193, 194] },
  { day: 26, week: 4, exam: '102', objIds: ['109.4'], title: 'クライアント側 DNS', goal: 'resolv.conf・nsswitch・dig/host/getent を整理する。',
    concepts: [
      { term: '/etc/resolv.conf', desc: 'nameserver/search/options。systemd-resolved 環境では実体が異なる。' },
      { term: '/etc/nsswitch.conf', desc: '名前解決の参照順序を hosts: で定義。例: "files dns"。' },
      { term: 'dig', desc: '構造的応答表示。+short、+trace、MX/NS/AAAA/TXT 等のレコード種別指定。' },
      { term: 'host', desc: '簡潔な DNS ルックアップ。-t でレコード種別指定。' },
      { term: 'getent', desc: 'NSS 経由で hosts/passwd/group/services を取得。' },
    ],
    commands: [
      { cmd: 'dig +short example.com', desc: 'A レコード' },
      { cmd: 'dig MX example.com', desc: 'MX レコード' },
    ],
    questionIds: [195, 196, 197] },
  { day: 27, week: 4, exam: '102', objIds: ['110.1', '110.2', '110.3'], title: 'セキュリティ統合', goal: 'sudo・SSH・GnuPG・TCP wrappers・shadow を運用に組込める。',
    concepts: [
      { term: 'sudo / visudo', desc: '/etc/sudoers と /etc/sudoers.d/。visudo で構文チェック付き編集。' },
      { term: 'SSH 鍵認証', desc: 'ssh-keygen → authorized_keys。known_hosts でなりすまし検知、ssh-agent で鍵管理。' },
      { term: 'SSH ポート転送', desc: '-L 局所→遠隔、-R 遠隔→局所、-D ダイナミック、-X X11、-A エージェント。' },
      { term: 'GnuPG', desc: '--full-generate-key、--encrypt、--sign、--verify。失効証明書を事前生成。' },
      { term: 'TCP wrappers', desc: '/etc/hosts.allow → /etc/hosts.deny の順で評価。許可優先。' },
      { term: 'シャドウパスワード', desc: '/etc/passwd と /etc/shadow を分離。pwconv/pwunconv で切替。' },
      { term: 'リソース制限', desc: 'ulimit でシェル単位、/etc/security/limits.conf で永続。' },
      { term: 'ログイン状況', desc: 'who / w 現在、last 履歴、lastb 失敗。' },
    ],
    commands: [
      { cmd: 'sudo visudo', desc: '構文チェック付き編集' },
      { cmd: 'ssh-keygen -t ed25519', desc: '鍵生成' },
      { cmd: 'gpg --full-generate-key', desc: 'GPG鍵生成' },
    ],
    questionIds: [198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217] },
  { day: 28, week: 4, exam: '102', objIds: ['101.2', '102.4', '103.5', '104.5', '105.2', '107.1', '108.2', '109.3', '110.3'], title: '模擬試験 + 総仕上げ', goal: '101+102 の全範囲から出題される擬似試験で本番想定の演習。',
    concepts: [
      { term: '本番への心構え', desc: '60問60分。迷ったら一度飛ばし、後で戻る。確実な問題から。' },
      { term: '弱点の特定', desc: '本日の結果で重点復習領域を決める。誤答カテゴリの傾向を見る。' },
      { term: '次のステップ', desc: 'このアプリで土台ができたら、次は LPI-Japan 認定教材 + Ping-t で量を確保。' },
    ],
    commands: [
      { cmd: '# 仕上げの鍵', desc: '誤答した問題は3日以内にもう一度。理由を声に出して説明できるか。' },
    ],
    questionIds: [6, 29, 75, 109, 124, 144, 167, 191, 211],
    isFinal: true },
];


// ─────────────────────────────────────────────
// 永続化(Firebase Firestore)
// ─────────────────────────────────────────────
import {
  signInWithGoogle,
  signOut as firebaseSignOut,
  subscribeAuth,
  loadUserProgress,
  saveUserProgress,
  subscribeUserProgress,
} from './firebase.js';

// ─────────────────────────────────────────────
// 本試験モード設定
// ─────────────────────────────────────────────
const MOCK_EXAM_DURATION_SEC = 60 * 60;  // 60分
const MOCK_EXAM_QUESTION_COUNT = 60;     // 60問
const MOCK_EXAM_PASS_LINE = 0.65;        // 65%
const GOLD_STREAK_TARGET = 2;            // 2回連続正解で金メダル

const emptyProgress = () => ({
  completedDays: [],
  dayResults: {},
  questionStats: {},
  fillStats: {},
  goldStreaks: {},
  goldenIds: [],
  mockHistory: [],
  weakIds: [],
  srs: {},
  streak: 0,
  lastStudyDate: null,
  totalAnswered: 0,
  totalCorrect: 0,
});

// 進捗データの読み書きは React コンポーネント側で uid と組み合わせて使用するため、
// ここではシンプルなラッパー関数を用意するのみ。
// 実体は firebase.js の loadUserProgress / saveUserProgress / subscribeUserProgress
const loadProgress = async (uid) => {
  if (!uid) return emptyProgress();
  const data = await loadUserProgress(uid);
  if (!data) return emptyProgress();
  const merged = { ...emptyProgress(), ...data };
  // 既存の苦手で、まだSRS未登録のものを「今日が期日」としてseed
  const srs = { ...(merged.srs || {}) };
  (merged.weakIds || []).forEach((id) => {
    if (!srs[id]) {
      srs[id] = { ease: 2.3, interval: 0, reps: 0, lapses: 1, due: todayStr() };
    }
  });
  merged.srs = srs;
  return merged;
};

const saveProgress = async (uid, progress) => {
  if (!uid) return;
  await saveUserProgress(uid, progress);
};

const clearProgress = async (uid) => {
  if (!uid) return;
  // 進捗をリセット = 空の状態を保存
  await saveUserProgress(uid, emptyProgress());
};

// ─────────────────────────────────────────────
// 日付ユーティリティ
// ─────────────────────────────────────────────
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const yesterdayStr = () => {
  const d = new Date(); d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const computeStreak = (lastDate, currentStreak) => {
  const t = todayStr();
  if (lastDate === t) return currentStreak; // 今日既に学習済
  if (lastDate === yesterdayStr()) return currentStreak + 1;
  return 1; // 空白あり or 初回
};

// ─────────────────────────────────────────────
// SRS（間隔反復 / SM-2 を28日試験向けに調整）
//   ・各問題: { ease, interval, reps, lapses, due }
//   ・due は 'YYYY-MM-DD'。due <= 今日 なら「今日の復習」に出る。
//   ・正解で間隔を伸ばし、不正解で翌日に戻す。
// ─────────────────────────────────────────────

// 今日から days 日後の 'YYYY-MM-DD' を返す
const addDaysStr = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// ある問題のSRS状態を1回ぶん更新して返す（純粋関数）
// prev: { ease, interval, reps, lapses, due } または undefined
// correct: true=正解 / false=不正解
const applySrs = (prev, correct) => {
  const base = prev ?? { ease: 2.3, interval: 0, reps: 0, lapses: 0, due: null };
  let { ease, interval, reps, lapses } = base;

  if (!correct) {
    reps = 0;
    interval = 1;                 // 翌日にもう一度
    lapses += 1;
    ease = Math.max(1.3, ease - 0.2);
  } else {
    if (reps === 0)      interval = 1;   // 初正解 → 翌日
    else if (reps === 1) interval = 3;   // 2連続 → 3日後
    else if (reps === 2) interval = 7;   // 3連続 → 1週間後
    else                 interval = Math.min(21, Math.round(interval * ease)); // 上限21日
    reps += 1;
    ease = Math.min(2.6, ease + 0.1);
  }

  return { ease: +ease.toFixed(2), interval, reps, lapses, due: addDaysStr(interval) };
};

// 復習期日（due <= 今日）に達した問題IDの配列を返す（四択 QUESTIONS 用・数値ID）
const getDueQuestionIds = (progress) => {
  const today = todayStr();
  return Object.entries(progress.srs || {})
    .filter(([, s]) => s && s.due && s.due <= today)
    .map(([id]) => Number(id));
};

// ─────────────────────────────────────────────
// メインコンポーネント
// ─────────────────────────────────────────────
export default function LpicActiveLearning() {
  const [user, setUser] = useState(null);          // Firebase ユーザ情報
  const [authLoading, setAuthLoading] = useState(true);  // 認証状態ロード中
  const [loading, setLoading] = useState(true);    // 進捗データロード中
  const [progress, setProgress] = useState(emptyProgress());
  const [screen, setScreen] = useState('dashboard');
  const [activeDay, setActiveDay] = useState(null);
  const [quizSession, setQuizSession] = useState(null);
  const [isSaving, setIsSaving] = useState(false); // 保存中表示用

  // 認証状態の監視
  useEffect(() => {
    const unsubscribe = subscribeAuth((u) => {
      setUser(u);
      setAuthLoading(false);
      if (!u) {
        // ログアウト時は進捗もクリア
        setProgress(emptyProgress());
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  // ログイン後: 進捗データのロード + リアルタイム同期
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    loadProgress(user.uid).then(p => {
      setProgress(p);
      setLoading(false);
    });
    // 他端末からの変更をリアルタイムに反映
    const unsub = subscribeUserProgress(user.uid, (newData) => {
      setProgress({ ...emptyProgress(), ...newData });
    });
    return unsub;
  }, [user]);

  // 進捗変更時に保存(デバウンスなしで毎回保存・Firestoreは効率的なので問題なし)
  useEffect(() => {
    if (!loading && user) {
      setIsSaving(true);
      saveProgress(user.uid, progress).finally(() => {
        setTimeout(() => setIsSaving(false), 500);
      });
    }
  }, [progress, loading, user]);

  const accuracy = progress.totalAnswered > 0
    ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100) : 0;

  // 今日のお題 = 完了していない最小Day
  const todayDayNum = useMemo(() => {
    for (let d = 1; d <= 28; d++) if (!progress.completedDays.includes(d)) return d;
    return null;
  }, [progress.completedDays]);

  // 試験準備度 = 達成日数 × 正解率の加重
  const examReadiness = useMemo(() => {
    const dayRate = progress.completedDays.length / 28;
    const accRate = progress.totalAnswered > 0 ? progress.totalCorrect / progress.totalAnswered : 0;
    const score = Math.round((dayRate * 0.55 + accRate * 0.45) * 100);
    let label, color;
    if (score >= 75) { label = '合格圏内'; color = '#4d7c47'; }
    else if (score >= 55) { label = 'もう一歩'; color = '#163a5f'; }
    else if (score >= 30) { label = '修練中'; color = '#7d6b4f'; }
    else { label = '出発点'; color = '#c1272d'; }
    return { score, label, color };
  }, [progress]);

  // カテゴリ別習熟度
  const categoryMastery = useMemo(() => {
    return CATEGORIES.map(c => {
      const qs = QUESTIONS.filter(q => q.category === c.id);
      let attempted = 0, correct = 0;
      qs.forEach(q => {
        const s = progress.questionStats[q.id];
        if (s && s.attempts > 0) {
          attempted += 1;
          if (s.correct / s.attempts >= 0.5) correct += 1;
        }
      });
      const total = qs.length;
      return {
        ...c,
        attempted, correct, total,
        coverage: total > 0 ? attempted / total : 0,
        mastery: attempted > 0 ? correct / attempted : 0,
      };
    });
  }, [progress.questionStats]);

  // ─── ハンドラ ───
  const startDay = (dayNum) => {
    setActiveDay(dayNum);
    setScreen('dailyLesson');
  };

  const startDayQuiz = (dayNum) => {
    const day = CURRICULUM.find(d => d.day === dayNum);
    if (!day) return;
    const qs = day.questionIds.map(id => QUESTIONS.find(q => q.id === id)).filter(Boolean);
    setQuizSession({ mode: 'day', dayNum, questions: qs, label: `Day ${dayNum} ${day.title}` });
    setScreen('quiz');
  };

  const startCategoryQuiz = (catId) => {
    const qs = QUESTIONS.filter(q => q.category === catId).sort(() => Math.random() - 0.5);
    const cat = CATEGORIES.find(c => c.id === catId);
    setQuizSession({ mode: 'category', catId, questions: qs, label: cat.name });
    setScreen('quiz');
  };

  const startReview = () => {
    if (progress.weakIds.length === 0) return;
    const qs = QUESTIONS.filter(q => progress.weakIds.includes(q.id)).sort(() => Math.random() - 0.5);
    setQuizSession({ mode: 'review', questions: qs, label: '苦手復習' });
    setScreen('quiz');
  };

  const startAllShuffle = () => {
    const qs = [...QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 12);
    setQuizSession({ mode: 'all', questions: qs, label: '全範囲シャッフル' });
    setScreen('quiz');
  };

  const startSrsReview = () => {
    const dueIds = getDueQuestionIds(progress);
    if (dueIds.length === 0) return;
    const qs = QUESTIONS
      .filter((q) => dueIds.includes(q.id))
      .sort(() => Math.random() - 0.5)
      .slice(0, 15); // 1回あたり最大15問
    setQuizSession({ mode: 'srsReview', questions: qs, label: '今日の復習' });
    setScreen('quiz');
  };

  const startFillQuiz = (filterFn) => {
    const pool = filterFn ? FILL_QUESTIONS.filter(filterFn) : FILL_QUESTIONS;
    const qs = [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(10, pool.length));
    setQuizSession({ mode: 'fill', questions: qs, label: '記述式(コマ問)' });
    setScreen('fillQuiz');
  };

  const startMockExam = (exam) => {
    // 出題範囲: exam='101' or '102' or 'both'
    let pool;
    if (exam === 'both') {
      pool = QUESTIONS;
    } else {
      const objs = OBJECTIVES.filter(o => o.exam === exam).map(o => o.id);
      pool = QUESTIONS.filter(q => q.obj.some(o => objs.includes(o)));
    }
    // 金メダル取得済みは除外しない(本試験モードでは復習も兼ねる)
    const count = Math.min(MOCK_EXAM_QUESTION_COUNT, pool.length);
    const qs = [...pool].sort(() => Math.random() - 0.5).slice(0, count);
    setQuizSession({ mode: 'mock', exam, questions: qs, label: `本試験モード(${exam})`, startedAt: Date.now() });
    setScreen('mockExam');
  };

  const finishMockExam = (results, durationSec) => {
    // 統計更新(問題ごとのstats、weakIds)
    const newStats = { ...progress.questionStats };
    const newGoldStreaks = { ...progress.goldStreaks };
    const newGoldenIds = [...progress.goldenIds];
    results.forEach(r => {
      const s = newStats[r.questionId] || { attempts: 0, correct: 0 };
      s.attempts += 1;
      if (r.correct) s.correct += 1;
      newStats[r.questionId] = s;
      // 金メダル方式
      if (r.correct) {
        newGoldStreaks[r.questionId] = (newGoldStreaks[r.questionId] || 0) + 1;
        if (newGoldStreaks[r.questionId] >= GOLD_STREAK_TARGET && !newGoldenIds.includes(r.questionId)) {
          newGoldenIds.push(r.questionId);
        }
      } else {
        newGoldStreaks[r.questionId] = 0;
        // 不正解で金メダル剥奪
        const idx = newGoldenIds.indexOf(r.questionId);
        if (idx >= 0) newGoldenIds.splice(idx, 1);
      }
    });
    const correctCount = results.filter(r => r.correct).length;
    const wrongIds = results.filter(r => !r.correct).map(r => r.questionId);
    const correctIds = results.filter(r => r.correct).map(r => r.questionId);
    const newWeak = Array.from(new Set([
      ...progress.weakIds.filter(id => !correctIds.includes(id)),
      ...wrongIds
    ]));
    const passed = correctCount / results.length >= MOCK_EXAM_PASS_LINE;
    const newHistory = [...progress.mockHistory, {
      date: todayStr(), exam: quizSession.exam, score: correctCount, total: results.length,
      durationSec, passed
    }].slice(-20);  // 直近20件のみ保持
    const newStreak = computeStreak(progress.lastStudyDate, progress.streak);

    // SRS更新（四択）
    const newSrs = { ...(progress.srs || {}) };
    results.forEach((r) => { newSrs[r.questionId] = applySrs(newSrs[r.questionId], r.correct); });

    setProgress({
      ...progress,
      questionStats: newStats,
      goldStreaks: newGoldStreaks,
      goldenIds: newGoldenIds,
      weakIds: newWeak,
      srs: newSrs,
      totalAnswered: progress.totalAnswered + results.length,
      totalCorrect: progress.totalCorrect + correctCount,
      streak: newStreak,
      lastStudyDate: todayStr(),
      mockHistory: newHistory,
    });
    setQuizSession({ ...quizSession, finalResults: results, durationSec, passed });
    setScreen('mockResult');
  };

  const finishFillQuiz = (results) => {
    // 記述式の統計更新
    const newFillStats = { ...progress.fillStats };
    results.forEach(r => {
      const s = newFillStats[r.questionId] || { attempts: 0, correct: 0 };
      s.attempts += 1;
      if (r.correct) s.correct += 1;
      newFillStats[r.questionId] = s;
    });
    const correctCount = results.filter(r => r.correct).length;
    const newStreak = computeStreak(progress.lastStudyDate, progress.streak);
    setProgress({
      ...progress,
      fillStats: newFillStats,
      totalAnswered: progress.totalAnswered + results.length,
      totalCorrect: progress.totalCorrect + correctCount,
      streak: newStreak,
      lastStudyDate: todayStr(),
    });
    setQuizSession({ ...quizSession, finalResults: results });
    setScreen('result');
  };

  const finishQuiz = (results) => {
    // 統計更新
    const newStats = { ...progress.questionStats };
    results.forEach(r => {
      const s = newStats[r.questionId] || { attempts: 0, correct: 0 };
      s.attempts += 1;
      if (r.correct) s.correct += 1;
      newStats[r.questionId] = s;
    });
    // 金メダル方式
    const newGoldStreaks2 = { ...progress.goldStreaks };
    const newGoldenIds2 = [...progress.goldenIds];
    results.forEach(r => {
      if (r.correct) {
        newGoldStreaks2[r.questionId] = (newGoldStreaks2[r.questionId] || 0) + 1;
        if (newGoldStreaks2[r.questionId] >= GOLD_STREAK_TARGET && !newGoldenIds2.includes(r.questionId)) {
          newGoldenIds2.push(r.questionId);
        }
      } else {
        newGoldStreaks2[r.questionId] = 0;
        const idx = newGoldenIds2.indexOf(r.questionId);
        if (idx >= 0) newGoldenIds2.splice(idx, 1);
      }
    });
    const correctCount = results.filter(r => r.correct).length;
    const wrongIds = results.filter(r => !r.correct).map(r => r.questionId);
    const correctIds = results.filter(r => r.correct).map(r => r.questionId);
    const newWeak = Array.from(new Set([
      ...progress.weakIds.filter(id => !correctIds.includes(id)),
      ...wrongIds
    ]));

    // Day完了処理
    let newCompleted = progress.completedDays;
    let newDayResults = progress.dayResults;
    if (quizSession?.mode === 'day') {
      const dayNum = quizSession.dayNum;
      const score = correctCount / results.length;
      newDayResults = { ...newDayResults, [dayNum]: { score, completedAt: todayStr() } };
      if (!newCompleted.includes(dayNum)) newCompleted = [...newCompleted, dayNum];
    }

    const newStreak = computeStreak(progress.lastStudyDate, progress.streak);

    // SRS更新（四択）
    const newSrs = { ...(progress.srs || {}) };
    results.forEach((r) => { newSrs[r.questionId] = applySrs(newSrs[r.questionId], r.correct); });

    setProgress({
      ...progress,
      questionStats: newStats,
      goldStreaks: newGoldStreaks2,
      goldenIds: newGoldenIds2,
      weakIds: newWeak,
      srs: newSrs,
      totalAnswered: progress.totalAnswered + results.length,
      totalCorrect: progress.totalCorrect + correctCount,
      completedDays: newCompleted,
      dayResults: newDayResults,
      streak: newStreak,
      lastStudyDate: todayStr(),
    });

    setQuizSession({ ...quizSession, finalResults: results });
    setScreen('result');
  };

  const goToDashboard = () => {
    setScreen('dashboard');
    setActiveDay(null);
    setQuizSession(null);
  };

  const handleReset = async () => {
    if (typeof window !== 'undefined' && window.confirm && !window.confirm('進捗をすべてリセットしますか?この操作は取り消せません。')) return;
    await clearProgress(user?.uid);
    setProgress(emptyProgress());
    setScreen('dashboard');
  };

  const handleSignOut = async () => {
    if (typeof window !== 'undefined' && window.confirm && !window.confirm('ログアウトしますか?')) return;
    await firebaseSignOut();
  };

  // ─── 共通スタイル ───
  const styleBlock = `
    @import url('https://fonts.googleapis.com/css2?family=Shippori+Mincho+B1:wght@400;500;600;700;800&family=Zen+Kaku+Gothic+New:wght@300;400;500;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

    .lc-mincho { font-family: 'Shippori Mincho B1', 'Noto Serif JP', serif; }
    .lc-gothic { font-family: 'Zen Kaku Gothic New', sans-serif; }
    .lc-mono   { font-family: 'JetBrains Mono', 'Menlo', monospace; }

    .lc-bg {
      background-color: #f3ecdb;
      background-image:
        radial-gradient(at 20% 20%, rgba(193, 39, 45, 0.04) 0px, transparent 50%),
        radial-gradient(at 80% 90%, rgba(22, 58, 95, 0.05) 0px, transparent 50%),
        radial-gradient(at 50% 50%, rgba(168, 152, 116, 0.06) 0px, transparent 70%);
    }
    .lc-paper {
      background: linear-gradient(180deg, #fdf8eb 0%, #faf3e0 100%);
      border: 1px solid #e3d6b8;
      box-shadow: 0 1px 0 rgba(255,255,255,0.7) inset, 0 8px 32px -12px rgba(60, 40, 20, 0.12);
    }
    .lc-paper-flat { background: #fdf8eb; border: 1px solid #e3d6b8; }
    .lc-divider { background-image: linear-gradient(90deg, transparent, #c1272d, transparent); height: 1px; opacity: 0.4; }
    .lc-stroke { background-image: repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(28,24,20,0.04) 8px, rgba(28,24,20,0.04) 9px); }

    @keyframes lc-fade-up { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes lc-fade-in { from { opacity: 0; } to { opacity: 1; } }
    @keyframes lc-scale-in { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
    @keyframes lc-pulse-soft { 0%, 100% { box-shadow: 0 0 0 0 rgba(77, 124, 71, 0.3); } 50% { box-shadow: 0 0 0 8px rgba(77, 124, 71, 0); } }
    @keyframes lc-shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-3px); } 75% { transform: translateX(3px); } }
    @keyframes lc-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

    .lc-anim-fadeup { animation: lc-fade-up 0.55s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; }
    .lc-anim-fadein { animation: lc-fade-in 0.4s ease-out forwards; }
    .lc-anim-scalein { animation: lc-scale-in 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    .lc-anim-shake { animation: lc-shake 0.4s ease-in-out; }
    .lc-anim-pulse { animation: lc-pulse-soft 1.6s ease-in-out infinite; }
    .lc-anim-blink { animation: lc-blink 1.2s ease-in-out infinite; }

    .lc-card-hover { transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s ease; }
    .lc-card-hover:hover { transform: translateY(-3px); box-shadow: 0 16px 36px -16px rgba(60, 40, 20, 0.25); }

    .lc-option-btn { transition: all 0.2s ease; }
    .lc-option-btn:not(:disabled):hover { border-color: #1c1814; background-color: #fffaeb; transform: translateX(4px); }

    .lc-snippet { background: #1a1612; color: #e8d9b8; border: 1px solid #2a2218; border-radius: 6px; box-shadow: inset 0 1px 0 rgba(255,255,255,0.05); }

    .lc-bar-fill { transition: width 1.1s cubic-bezier(0.2, 0.8, 0.2, 1); }
    .lc-tab { transition: all 0.2s ease; }

    .lc-cell { transition: all 0.25s ease; }
    .lc-cell:hover { transform: scale(1.08); }

    details > summary { list-style: none; }
    details > summary::-webkit-details-marker { display: none; }
  `;

  // 認証状態の確認中
  if (authLoading) {
    return (
      <div className="min-h-screen lc-bg lc-gothic flex items-center justify-center" style={{ color: '#1c1814' }}>
        <style>{styleBlock}</style>
        <div className="lc-mincho text-2xl">
          <span style={{ opacity: 0.6 }}>道場開門中</span>
          <span className="lc-mono ml-2 lc-anim-blink" style={{ color: '#c1272d' }}>_</span>
        </div>
      </div>
    );
  }

  // 未ログイン: ログイン画面を表示
  if (!user) {
    return <LoginScreen styleBlock={styleBlock} />;
  }

  // 進捗データのロード中
  if (loading) {
    return (
      <div className="min-h-screen lc-bg lc-gothic flex items-center justify-center" style={{ color: '#1c1814' }}>
        <style>{styleBlock}</style>
        <div className="lc-mincho text-2xl">
          <span style={{ opacity: 0.6 }}>修行録を呼び戻し中</span>
          <span className="lc-mono ml-2 lc-anim-blink" style={{ color: '#c1272d' }}>_</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full lc-bg lc-gothic" style={{ color: '#1c1814' }}>
      <style>{styleBlock}</style>

      {/* グローバルナビ */}
      {(screen === 'dashboard' || screen === 'curriculum' || screen === 'library' || screen === 'examPrep') && (
        <TopNav
          screen={screen} setScreen={setScreen}
          accuracy={accuracy} streak={progress.streak}
          user={user} isSaving={isSaving}
          onSignOut={handleSignOut}
        />
      )}

      {screen === 'dashboard' && (
        <Dashboard
          progress={progress}
          accuracy={accuracy}
          todayDayNum={todayDayNum}
          examReadiness={examReadiness}
          categoryMastery={categoryMastery}
          onStartToday={() => todayDayNum && startDay(todayDayNum)}
          onStartDay={startDay}
          onReview={startReview}
          onSrsReview={startSrsReview}
          onShuffle={startAllShuffle}
          onReset={handleReset}
        />
      )}
      {screen === 'curriculum' && (
        <CurriculumScreen
          progress={progress}
          todayDayNum={todayDayNum}
          onStartDay={startDay}
        />
      )}
      {screen === 'library' && (
        <LibraryScreen
          progress={progress}
          categoryMastery={categoryMastery}
          onStartCategory={startCategoryQuiz}
          onShuffle={startAllShuffle}
          onReview={startReview}
        />
      )}
      {screen === 'examPrep' && (
        <ExamPrepScreen
          progress={progress}
          onStartFillQuiz={startFillQuiz}
          onStartMockExam={startMockExam}
        />
      )}
      {screen === 'mockExam' && quizSession && (
        <MockExamScreen
          session={quizSession}
          onFinish={finishMockExam}
          onAbort={goToDashboard}
        />
      )}
      {screen === 'mockResult' && quizSession?.finalResults && (
        <MockResultScreen
          session={quizSession}
          progress={progress}
          onHome={goToDashboard}
          onRetry={() => startMockExam(quizSession.exam)}
        />
      )}
      {screen === 'fillQuiz' && quizSession && (
        <FillQuizScreen
          session={quizSession}
          onFinish={finishFillQuiz}
          onExit={goToDashboard}
        />
      )}
      {screen === 'dailyLesson' && activeDay && (
        <DailyLessonScreen
          dayNum={activeDay}
          progress={progress}
          onStartQuiz={() => startDayQuiz(activeDay)}
          onBack={goToDashboard}
        />
      )}
      {screen === 'quiz' && quizSession && (
        <QuizScreen
          session={quizSession}
          onFinish={finishQuiz}
          onExit={goToDashboard}
        />
      )}
      {screen === 'result' && quizSession?.finalResults && (
        <ResultScreen
          session={quizSession}
          progress={progress}
          onHome={goToDashboard}
          onRetry={() => {
            if (quizSession.mode === 'day') startDayQuiz(quizSession.dayNum);
            else if (quizSession.mode === 'category') startCategoryQuiz(quizSession.catId);
            else if (quizSession.mode === 'review') startReview();
            else startAllShuffle();
          }}
          onReview={startReview}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// 上部ナビ
// ─────────────────────────────────────────────
function TopNav({ screen, setScreen, accuracy, streak, user, isSaving, onSignOut }) {
  const [showMenu, setShowMenu] = useState(false);
  const tabs = [
    { id: 'dashboard',  label: '道場',     icon: Compass },
    { id: 'curriculum', label: '修行録',   icon: Calendar },
    { id: 'library',    label: '自由稽古', icon: Library },
    { id: 'examPrep',   label: '試験対策', icon: Award },
  ];
  return (
    <div className="border-b sticky top-0 z-20 backdrop-blur" style={{ borderColor: '#e3d6b8', background: 'rgba(243, 236, 219, 0.85)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-10 py-3 flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2">
          <span className="lc-mincho font-bold text-sm sm:text-base" style={{ color: '#1c1814' }}>言の葉<span className="lc-mono mx-1 text-xs" style={{ color: "#7d6b4f" }}>×</span>LPIC</span>
        </div>
        <div className="flex items-center gap-1">
          {tabs.map(t => {
            const Icon = t.icon;
            const active = screen === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setScreen(t.id)}
                className="lc-tab lc-mincho text-xs sm:text-sm px-2 sm:px-4 py-2 rounded-md flex items-center gap-1 sm:gap-2 hover:bg-black/5"
                style={{
                  color: active ? '#c1272d' : '#1c1814',
                  background: active ? 'rgba(193, 39, 45, 0.08)' : 'transparent',
                  fontWeight: active ? 600 : 400,
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 text-xs">
          {/* 同期ステータス */}
          {isSaving && (
            <span className="hidden md:flex items-center gap-1 lc-mono" style={{ color: '#4d7c47' }}>
              <span className="w-1.5 h-1.5 rounded-full lc-anim-blink" style={{ background: '#4d7c47' }} />
              同期中
            </span>
          )}
          {streak > 0 && (
            <div className="hidden md:flex items-center gap-1" style={{ color: '#c1272d' }}>
              <Flame className="w-3.5 h-3.5" />
              <span className="lc-mono font-bold">{streak}</span>
              <span className="lc-mincho">日連続</span>
            </div>
          )}
          <div className="hidden md:block lc-mono" style={{ color: '#7d6b4f' }}>正解率 <span className="font-bold" style={{ color: '#163a5f' }}>{accuracy}%</span></div>

          {/* ユーザメニュー */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-1 px-1 py-1 rounded-full hover:bg-black/5 transition-colors"
                aria-label="ユーザメニュー"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center lc-mincho text-xs font-bold" style={{ background: '#1c1814', color: '#f3ecdb' }}>
                    {(user.displayName || user.email || 'U')[0]}
                  </div>
                )}
              </button>
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 top-full mt-2 lc-paper rounded-lg p-3 min-w-[200px] z-40 lc-anim-fadein">
                    <div className="lc-mincho text-xs mb-2" style={{ color: '#7d6b4f' }}>ログイン中</div>
                    <div className="lc-mincho text-sm font-bold mb-1 truncate" style={{ color: '#1c1814' }}>
                      {user.displayName || 'ユーザ'}
                    </div>
                    <div className="lc-mono text-[10px] mb-3 truncate" style={{ color: '#7d6b4f' }}>
                      {user.email}
                    </div>
                    <div className="lc-divider mb-2" />
                    <button
                      onClick={() => { setShowMenu(false); onSignOut(); }}
                      className="w-full text-left lc-mincho text-sm px-2 py-1.5 rounded hover:bg-black/5 transition-colors"
                      style={{ color: '#c1272d' }}
                    >
                      ログアウト
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 道場(ダッシュボード)
// ─────────────────────────────────────────────
function Dashboard({ progress, accuracy, todayDayNum, examReadiness, categoryMastery, onStartToday, onStartDay, onReview, onSrsReview, onShuffle, onReset }) {
  const todayDay = todayDayNum ? CURRICULUM.find(d => d.day === todayDayNum) : null;
  const completedRate = Math.round((progress.completedDays.length / 28) * 100);
  const todayDone = progress.lastStudyDate === todayStr();
  const dueCount = getDueQuestionIds(progress).length;

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-10 py-8 sm:py-12">
      {/* 見出し */}
      <header className="mb-8 lc-anim-fadeup">
        <div className="flex items-center gap-3 mb-2">
          <span className="lc-mincho text-xs tracking-[0.4em]" style={{ color: '#c1272d' }}>道場・本日のお題</span>
          <span className="h-px flex-1 max-w-16" style={{ background: '#c1272d', opacity: 0.4 }} />
        </div>
        <h1 className="lc-mincho font-bold text-3xl sm:text-4xl" style={{ color: '#1c1814' }}>
          {todayDone ? '今日の鍛錬を終えました' : '今日も一手、刻もう'}
        </h1>
      </header>

      {/* 今日のお題カード */}
      {todayDay ? (
        <div className="lc-paper rounded-2xl p-6 sm:p-8 mb-8 lc-anim-fadeup relative overflow-hidden" style={{ animationDelay: '0.05s' }}>
          <div className="absolute -right-6 -bottom-10 lc-mincho font-bold pointer-events-none select-none" style={{ fontSize: '12rem', color: '#c1272d', opacity: 0.06, lineHeight: 1 }}>
            {todayDay.day}
          </div>
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="lc-mono text-[10px] px-2 py-0.5 rounded-full" style={{ background: '#c1272d18', color: '#c1272d' }}>DAY {String(todayDay.day).padStart(2, '0')} / 28</span>
                <span className="lc-mincho text-[11px]" style={{ color: '#7d6b4f' }}>第{todayDay.week}週・{WEEKS[todayDay.week - 1].title}</span>
              </div>
              <h2 className="lc-mincho font-bold text-2xl sm:text-3xl mb-2" style={{ color: '#1c1814' }}>{todayDay.title}</h2>
              <p className="lc-mincho text-sm" style={{ color: '#3d342a' }}>{todayDay.goal}</p>
              <div className="flex items-center gap-3 mt-3 text-xs" style={{ color: '#7d6b4f' }}>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />15-20分</span>
                <span className="flex items-center gap-1"><Hash className="w-3 h-3" />{todayDay.questionIds.length}問</span>
              </div>
            </div>
            <div>
              <button
                onClick={onStartToday}
                className="w-full px-6 py-4 rounded-lg flex items-center justify-center gap-2 lc-mincho font-semibold transition-all hover:translate-y-[-2px] hover:shadow-lg"
                style={{ background: '#1c1814', color: '#f3ecdb' }}
              >
                <Lightbulb className="w-4 h-4" />
                今日の修練を始める
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="lc-paper rounded-2xl p-8 mb-8 text-center lc-anim-fadeup">
          <Trophy className="w-10 h-10 mx-auto mb-3" style={{ color: '#c1272d' }} />
          <h2 className="lc-mincho font-bold text-2xl mb-2">全課程修了</h2>
          <p className="lc-mincho text-sm mb-4" style={{ color: '#7d6b4f' }}>28日のカリキュラムを修めました。あとは弱点を磨くのみ。</p>
          <button onClick={onReview} className="px-6 py-3 rounded-md lc-mincho font-semibold text-sm" style={{ background: '#c1272d', color: '#fff' }}>
            苦手を総ざらい
          </button>
        </div>
      )}

      {/* 進捗3指標 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="完了日数"
          value={`${progress.completedDays.length}`}
          unit={`/ 28`}
          subtitle={`${completedRate}% 達成`}
          icon={Calendar}
          color="#163a5f"
          delay={0.1}
        />
        <StatCard
          label="累計正解率"
          value={`${accuracy}`}
          unit="%"
          subtitle={`${progress.totalCorrect} / ${progress.totalAnswered} 問`}
          icon={Target}
          color="#4d7c47"
          delay={0.15}
        />
        <StatCard
          label="連続学習"
          value={`${progress.streak}`}
          unit="日"
          subtitle={progress.streak > 0 ? '継続は力なり' : '今日から再起動'}
          icon={Flame}
          color="#c1272d"
          delay={0.2}
        />
        <StatCard
          label="苦手問題"
          value={`${progress.weakIds.length}`}
          unit="問"
          subtitle={progress.weakIds.length > 0 ? '復習で消化' : '課題なし'}
          icon={Lightbulb}
          color="#7d6b4f"
          delay={0.25}
        />
      </div>

      {/* 試験準備度 */}
      <div className="lc-paper rounded-xl p-6 mb-8 lc-anim-fadeup" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h3 className="lc-mincho font-bold text-lg flex items-center gap-2">
              <Award className="w-5 h-5" style={{ color: examReadiness.color }} />
              試験合格までの距離
            </h3>
            <p className="lc-mincho text-xs mt-1" style={{ color: '#7d6b4f' }}>達成日数と正解率を加重平均した目安</p>
          </div>
          <div className="text-right">
            <div className="lc-mincho text-3xl font-bold" style={{ color: examReadiness.color }}>
              {examReadiness.score}<span className="text-base">%</span>
            </div>
            <div className="lc-mincho text-xs font-semibold" style={{ color: examReadiness.color }}>{examReadiness.label}</div>
          </div>
        </div>
        <div className="relative h-3 rounded-full overflow-hidden" style={{ background: '#1c181410' }}>
          <div className="absolute inset-y-0 left-0 lc-bar-fill rounded-full" style={{ width: `${examReadiness.score}%`, background: `linear-gradient(90deg, ${examReadiness.color}, ${examReadiness.color}dd)` }} />
          {/* 合格ライン目印 */}
          <div className="absolute top-0 bottom-0" style={{ left: '75%', width: '2px', background: '#1c1814', opacity: 0.4 }} />
          <div className="absolute -top-5 lc-mono text-[9px]" style={{ left: 'calc(75% - 18px)', color: '#7d6b4f' }}>合格圏 75%</div>
        </div>
      </div>

      {/* 28日カレンダー */}
      <div className="lc-paper rounded-xl p-6 mb-8 lc-anim-fadeup" style={{ animationDelay: '0.35s' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="lc-mincho font-bold text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5" style={{ color: '#163a5f' }} />
            28日の歩み
          </h3>
          <span className="lc-mono text-xs" style={{ color: '#7d6b4f' }}>{progress.completedDays.length} / 28 完了</span>
        </div>
        <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(14, minmax(0, 1fr))' }}>
          {CURRICULUM.map((d, i) => {
            const done = progress.completedDays.includes(d.day);
            const result = progress.dayResults[d.day];
            const isToday = d.day === todayDayNum;
            let bg = '#1c181410', color = '#7d6b4f', border = 'transparent';
            if (done) {
              const score = result?.score ?? 0;
              if (score >= 0.8) { bg = '#4d7c47'; color = '#fff'; }
              else if (score >= 0.6) { bg = '#7c9a4d'; color = '#fff'; }
              else { bg = '#c1272d'; color = '#fff'; }
            }
            if (isToday) border = '#1c1814';
            return (
              <button
                key={d.day}
                onClick={() => onStartDay(d.day)}
                className="lc-cell aspect-square rounded-md flex items-center justify-center lc-mono text-[10px] font-bold relative"
                style={{ background: bg, color, border: `1.5px solid ${border}`, animationDelay: `${i * 0.012}s` }}
                title={`Day ${d.day}: ${d.title}`}
              >
                {d.day}
                {d.isFinal && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full" style={{ background: '#c1272d' }} />}
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex items-center gap-3 flex-wrap text-[10px] lc-mono" style={{ color: '#7d6b4f' }}>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm" style={{ background: '#4d7c47' }} />80%以上</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm" style={{ background: '#7c9a4d' }} />60-79%</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm" style={{ background: '#c1272d' }} />60%未満</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm border-[1.5px]" style={{ borderColor: '#1c1814', background: '#1c181410' }} />本日</span>
        </div>
      </div>

      {/* カテゴリ習熟度 */}
      <div className="lc-paper rounded-xl p-6 mb-8 lc-anim-fadeup" style={{ animationDelay: '0.4s' }}>
        <h3 className="lc-mincho font-bold text-lg mb-5 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" style={{ color: '#4d7c47' }} />
          章別の習熟度
        </h3>
        <div className="space-y-3">
          {categoryMastery.map((c, i) => (
            <div key={c.id} className="lc-anim-fadeup" style={{ animationDelay: `${0.45 + i * 0.04}s` }}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="lc-mincho font-bold text-base" style={{ color: c.accent }}>{c.kanji}</span>
                  <span className="lc-mincho text-sm font-medium">{c.name}</span>
                </div>
                <span className="lc-mono text-[11px]" style={{ color: '#7d6b4f' }}>
                  {c.attempted}/{c.total}問 · 習熟 {Math.round(c.mastery * 100)}%
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden flex" style={{ background: '#1c181408' }}>
                <div className="lc-bar-fill h-full" style={{ width: `${c.mastery * (c.attempted / c.total) * 100}%`, background: c.accent }} />
                <div className="lc-bar-fill h-full" style={{ width: `${(1 - c.mastery) * (c.attempted / c.total) * 100}%`, background: `${c.accent}40` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 補助的アクション */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={onSrsReview}
          disabled={dueCount === 0}
          className={`lc-paper rounded-lg p-5 flex items-center gap-4 text-left lc-anim-fadeup ${dueCount > 0 ? 'lc-card-hover' : 'opacity-50 cursor-not-allowed'}`}
          style={{ animationDelay: '0.5s' }}
        >
          <div className="w-11 h-11 rounded-md flex items-center justify-center" style={{ background: '#163a5f18' }}>
            <Calendar className="w-5 h-5" style={{ color: '#163a5f' }} />
          </div>
          <div className="flex-1">
            <div className="lc-mincho font-semibold">今日の復習</div>
            <div className="lc-mincho text-xs" style={{ color: '#7d6b4f' }}>
              {dueCount > 0 ? `${dueCount}問が復習の期日です` : '今日の復習はありません'}
            </div>
          </div>
          <ChevronRight className="w-4 h-4" />
        </button>
        <button onClick={onShuffle} className="lc-paper lc-card-hover rounded-lg p-5 flex items-center gap-4 text-left lc-anim-fadeup" style={{ animationDelay: '0.55s' }}>
          <div className="w-11 h-11 rounded-md flex items-center justify-center" style={{ background: '#1c181410' }}>
            <Sparkles className="w-5 h-5" style={{ color: '#1c1814' }} />
          </div>
          <div className="flex-1">
            <div className="lc-mincho font-semibold">全範囲シャッフル(12問)</div>
            <div className="lc-mincho text-xs" style={{ color: '#7d6b4f' }}>気分転換に短時間で総当たり</div>
          </div>
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={onReview}
          disabled={progress.weakIds.length === 0}
          className={`lc-paper rounded-lg p-5 flex items-center gap-4 text-left lc-anim-fadeup ${progress.weakIds.length > 0 ? 'lc-card-hover' : 'opacity-50 cursor-not-allowed'}`}
          style={{ animationDelay: '0.6s' }}
        >
          <div className="w-11 h-11 rounded-md flex items-center justify-center" style={{ background: '#c1272d18' }}>
            <Target className="w-5 h-5" style={{ color: '#c1272d' }} />
          </div>
          <div className="flex-1">
            <div className="lc-mincho font-semibold">苦手だけを復習</div>
            <div className="lc-mincho text-xs" style={{ color: '#7d6b4f' }}>
              {progress.weakIds.length > 0 ? `${progress.weakIds.length}問の弱点を集中突破` : 'まだ苦手は記録されていません'}
            </div>
          </div>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* リセット(地味) */}
      <div className="text-center mt-12">
        <button onClick={onReset} className="lc-mincho text-xs hover:underline" style={{ color: '#7d6b4f', opacity: 0.6 }}>
          進捗をリセット
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 数値カード
// ─────────────────────────────────────────────
function StatCard({ label, value, unit, subtitle, icon: Icon, color, delay }) {
  return (
    <div className="lc-paper rounded-lg p-4 lc-anim-fadeup" style={{ animationDelay: `${delay}s` }}>
      <div className="flex items-center justify-between mb-2">
        <span className="lc-mincho text-xs tracking-wider" style={{ color: '#7d6b4f' }}>{label}</span>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div className="flex items-baseline gap-1">
        <span className="lc-mincho text-3xl font-bold" style={{ color: '#1c1814' }}>{value}</span>
        <span className="lc-mincho text-sm" style={{ color: '#7d6b4f' }}>{unit}</span>
      </div>
      <div className="lc-mincho text-[11px] mt-1" style={{ color: '#7d6b4f' }}>{subtitle}</div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 修行録(カリキュラム一覧)
// ─────────────────────────────────────────────
function CurriculumScreen({ progress, todayDayNum, onStartDay }) {
  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-10 py-8 sm:py-12">
      <header className="mb-8 lc-anim-fadeup">
        <div className="flex items-center gap-2 mb-2">
          <span className="lc-mincho text-xs tracking-[0.4em]" style={{ color: '#c1272d' }}>修行録・全28日</span>
        </div>
        <h1 className="lc-mincho font-bold text-3xl sm:text-4xl mb-2">合格までの28日</h1>
        <p className="lc-mincho text-sm" style={{ color: '#6b5d4f' }}>四週に分けて段階的に積み上げる。各日15-20分・3〜8問の演習。</p>
      </header>

      {WEEKS.map((week, weekIdx) => {
        const days = CURRICULUM.filter(d => d.week === week.num);
        const weekDone = days.filter(d => progress.completedDays.includes(d.day)).length;
        return (
          <section key={week.num} className="mb-10 lc-anim-fadeup" style={{ animationDelay: `${weekIdx * 0.08}s` }}>
            <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-baseline gap-3">
                <span className="lc-mincho text-3xl font-bold" style={{ color: '#c1272d' }}>第{week.num}週</span>
                <h2 className="lc-mincho text-xl font-semibold">{week.title}</h2>
                <span className="lc-mincho text-xs" style={{ color: '#7d6b4f' }}>{week.subtitle}</span>
              </div>
              <span className="lc-mono text-xs" style={{ color: '#7d6b4f' }}>{weekDone} / {days.length} 完了</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {days.map((d, i) => {
                const done = progress.completedDays.includes(d.day);
                const result = progress.dayResults[d.day];
                const isToday = d.day === todayDayNum;
                const score = result ? Math.round(result.score * 100) : null;
                let scoreColor = '#7d6b4f';
                if (score !== null) {
                  if (score >= 80) scoreColor = '#4d7c47';
                  else if (score >= 60) scoreColor = '#163a5f';
                  else scoreColor = '#c1272d';
                }
                return (
                  <button
                    key={d.day}
                    onClick={() => onStartDay(d.day)}
                    className="lc-paper lc-card-hover rounded-lg p-4 text-left relative overflow-hidden lc-anim-fadeup"
                    style={{ animationDelay: `${i * 0.04 + 0.1}s`, borderColor: isToday ? '#c1272d' : '#e3d6b8', borderWidth: isToday ? '2px' : '1px' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="lc-mono text-[10px]" style={{ color: '#7d6b4f' }}>DAY {String(d.day).padStart(2, '0')}</span>
                      {done ? (
                        <span className="flex items-center gap-1">
                          <Check className="w-3 h-3" style={{ color: scoreColor }} />
                          <span className="lc-mono text-[10px] font-bold" style={{ color: scoreColor }}>{score}%</span>
                        </span>
                      ) : isToday ? (
                        <span className="lc-mono text-[10px] px-2 py-0.5 rounded-full lc-anim-blink" style={{ background: '#c1272d', color: '#fff' }}>本日</span>
                      ) : (
                        <span className="w-2 h-2 rounded-full" style={{ background: '#7d6b4f', opacity: 0.3 }} />
                      )}
                    </div>
                    <h3 className="lc-mincho font-semibold text-sm mb-1 leading-snug" style={{ color: '#1c1814' }}>
                      {d.title}
                    </h3>
                    <p className="lc-mincho text-[11px] leading-relaxed" style={{ color: '#7d6b4f' }}>
                      {d.goal}
                    </p>
                    {(d.isReview || d.isFinal) && (
                      <span className="lc-mono text-[9px] mt-2 inline-block px-1.5 py-0.5 rounded" style={{ background: '#c1272d18', color: '#c1272d' }}>
                        {d.isFinal ? 'FINAL' : 'REVIEW'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
// 自由稽古(章別の自由練習)
// ─────────────────────────────────────────────
function LibraryScreen({ progress, categoryMastery, onStartCategory, onShuffle, onReview }) {
  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-10 py-8 sm:py-12">
      <header className="mb-8 lc-anim-fadeup">
        <div className="flex items-center gap-2 mb-2">
          <span className="lc-mincho text-xs tracking-[0.4em]" style={{ color: '#c1272d' }}>自由稽古・章を選ぶ</span>
        </div>
        <h1 className="lc-mincho font-bold text-3xl sm:text-4xl mb-2">気になる章を集中演習</h1>
        <p className="lc-mincho text-sm" style={{ color: '#6b5d4f' }}>カリキュラムから外れて、特定の領域だけを反復したい時の場。</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {categoryMastery.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => onStartCategory(cat.id)}
              className="lc-paper lc-card-hover rounded-lg p-5 text-left relative overflow-hidden lc-anim-fadeup"
              style={{ animationDelay: `${i * 0.04 + 0.05}s` }}
            >
              <span className="absolute -right-2 -bottom-4 lc-mincho font-bold pointer-events-none select-none" style={{ fontSize: '5.5rem', color: cat.accent, opacity: 0.08, lineHeight: 1 }}>
                {cat.kanji}
              </span>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-md flex items-center justify-center" style={{ background: `${cat.accent}18`, color: cat.accent }}>
                    <Icon className="w-4 h-4" strokeWidth={1.8} />
                  </div>
                  {cat.attempted > 0 && (
                    <span className="lc-mono text-[10px] px-2 py-0.5 rounded-full" style={{ background: '#1c181408', color: cat.accent }}>
                      {Math.round(cat.mastery * 100)}%
                    </span>
                  )}
                </div>
                <h3 className="lc-mincho font-semibold text-base mb-1">{cat.name}</h3>
                <p className="lc-mincho text-xs mb-3" style={{ color: '#7d6b4f' }}>{cat.subtitle}</p>
                <div className="flex items-center justify-between">
                  <span className="lc-mono text-[10px]" style={{ color: '#7d6b4f' }}>{cat.attempted} / {cat.total}問</span>
                  <ChevronRight className="w-3.5 h-3.5" style={{ color: cat.accent }} />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button onClick={onShuffle} className="lc-paper lc-card-hover rounded-lg p-5 flex items-center gap-4 text-left">
          <div className="w-11 h-11 rounded-md flex items-center justify-center" style={{ background: '#1c181410' }}>
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="lc-mincho font-semibold">全範囲シャッフル</div>
            <div className="lc-mincho text-xs" style={{ color: '#7d6b4f' }}>12問をランダム抽出</div>
          </div>
          <ChevronRight className="w-4 h-4" />
        </button>
        <button onClick={onReview} disabled={progress.weakIds.length === 0}
          className={`lc-paper rounded-lg p-5 flex items-center gap-4 text-left ${progress.weakIds.length > 0 ? 'lc-card-hover' : 'opacity-50 cursor-not-allowed'}`}>
          <div className="w-11 h-11 rounded-md flex items-center justify-center" style={{ background: '#c1272d18' }}>
            <Target className="w-5 h-5" style={{ color: '#c1272d' }} />
          </div>
          <div className="flex-1">
            <div className="lc-mincho font-semibold">苦手復習</div>
            <div className="lc-mincho text-xs" style={{ color: '#7d6b4f' }}>{progress.weakIds.length}問</div>
          </div>
          <ChevronRight className="w-4 h-4" style={{ color: '#c1272d' }} />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// デイリーレッスン
// ─────────────────────────────────────────────
function DailyLessonScreen({ dayNum, progress, onStartQuiz, onBack }) {
  const day = CURRICULUM.find(d => d.day === dayNum);
  if (!day) return null;
  const previousResult = progress.dayResults[dayNum];

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-10 py-8 sm:py-12">
      <button onClick={onBack} className="flex items-center gap-2 lc-mincho text-sm mb-6 hover:opacity-70" style={{ color: '#6b5d4f' }}>
        <ArrowLeft className="w-4 h-4" />
        戻る
      </button>

      {/* ヘッダー */}
      <div className="mb-8 lc-anim-fadeup">
        <div className="flex items-center gap-2 mb-3">
          <span className="lc-mono text-[10px] px-2 py-0.5 rounded-full" style={{ background: '#c1272d18', color: '#c1272d' }}>DAY {String(day.day).padStart(2, '0')} / 28</span>
          <span className="lc-mincho text-xs" style={{ color: '#7d6b4f' }}>第{day.week}週・{WEEKS[day.week - 1].title}</span>
          {day.isReview && <span className="lc-mono text-[10px] px-2 py-0.5 rounded" style={{ background: '#163a5f18', color: '#163a5f' }}>REVIEW</span>}
          {day.isFinal && <span className="lc-mono text-[10px] px-2 py-0.5 rounded" style={{ background: '#c1272d', color: '#fff' }}>FINAL</span>}
        </div>
        <h1 className="lc-mincho font-bold text-3xl sm:text-4xl mb-3" style={{ color: '#1c1814' }}>{day.title}</h1>
        <p className="lc-mincho text-base leading-relaxed" style={{ color: '#3d342a' }}>{day.goal}</p>
        {previousResult && (
          <div className="mt-4 lc-paper-flat inline-flex items-center gap-2 px-3 py-1.5 rounded">
            <Check className="w-3.5 h-3.5" style={{ color: '#4d7c47' }} />
            <span className="lc-mincho text-xs" style={{ color: '#7d6b4f' }}>
              前回スコア <span className="lc-mono font-bold" style={{ color: '#163a5f' }}>{Math.round(previousResult.score * 100)}%</span>
            </span>
          </div>
        )}
      </div>

      <div className="lc-divider mb-8" />

      {/* 概念 */}
      <section className="mb-8 lc-anim-fadeup" style={{ animationDelay: '0.1s' }}>
        <h2 className="lc-mincho font-bold text-lg mb-4 flex items-center gap-2">
          <Lightbulb className="w-4 h-4" style={{ color: '#c1272d' }} />
          押さえる概念
        </h2>
        <div className="space-y-4">
          {day.concepts.map((c, i) => (
            <div key={i} className="lc-paper rounded-lg p-4 lc-anim-fadeup" style={{ animationDelay: `${0.15 + i * 0.05}s` }}>
              <div className="flex items-start gap-3">
                <span className="lc-mincho font-bold text-base shrink-0" style={{ color: '#c1272d' }}>•</span>
                <div className="flex-1">
                  <div className="lc-mincho font-semibold mb-1" style={{ color: '#1c1814' }}>{c.term}</div>
                  <p className="lc-gothic text-sm leading-relaxed" style={{ color: '#3d342a' }}>{c.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 重要コマンド */}
      {day.commands && day.commands.length > 0 && (
        <section className="mb-10 lc-anim-fadeup" style={{ animationDelay: '0.3s' }}>
          <h2 className="lc-mincho font-bold text-lg mb-4 flex items-center gap-2">
            <Terminal className="w-4 h-4" style={{ color: '#163a5f' }} />
            重要コマンド
          </h2>
          <div className="lc-snippet p-4 space-y-2">
            {day.commands.map((c, i) => (
              <div key={i} className="lc-anim-fadeup" style={{ animationDelay: `${0.35 + i * 0.04}s` }}>
                <div className="lc-mono text-sm" style={{ color: '#e8d9b8' }}>{c.cmd}</div>
                <div className="lc-mono text-[10px] mb-2" style={{ color: '#a89880' }}># {c.desc}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* スタートボタン */}
      <button
        onClick={onStartQuiz}
        className="w-full px-6 py-4 rounded-lg flex items-center justify-center gap-2 lc-mincho font-semibold transition-all hover:translate-y-[-2px] hover:shadow-lg lc-anim-fadeup"
        style={{ background: '#1c1814', color: '#f3ecdb', animationDelay: '0.5s' }}
      >
        <Hash className="w-4 h-4" />
        本日の演習({day.questionIds.length}問)へ
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// クイズ画面
// ─────────────────────────────────────────────
function QuizScreen({ session, onFinish, onExit }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [results, setResults] = useState([]);
  const { questions, label } = session;
  const q = questions[currentIdx];
  const cat = CATEGORIES.find(c => c.id === q.category);
  const Icon = cat?.icon || Terminal;
  const isCorrect = selected === q.answer;
  const progress = ((currentIdx + (showFeedback ? 1 : 0)) / questions.length) * 100;

  const handleAnswer = (idx) => {
    if (showFeedback) return;
    setSelected(idx);
    setShowFeedback(true);
    setResults(prev => [...prev, { questionId: q.id, selected: idx, correct: idx === q.answer, question: q }]);
  };

  const next = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelected(null);
      setShowFeedback(false);
    } else {
      onFinish(results);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 sm:py-12">
      <header className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onExit} className="flex items-center gap-2 lc-mincho text-sm hover:opacity-70" style={{ color: '#6b5d4f' }}>
            <ArrowLeft className="w-4 h-4" />やめる
          </button>
          <span className="lc-mono text-xs" style={{ color: '#7d6b4f' }}>
            {String(currentIdx + 1).padStart(2, '0')} <span style={{ opacity: 0.4 }}>/ {String(questions.length).padStart(2, '0')}</span>
          </span>
        </div>
        <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: '#1c181410' }}>
          <div className="h-full transition-all duration-500" style={{ width: `${progress}%`, background: cat?.accent || '#163a5f' }} />
        </div>
        <div className="mt-4 flex items-center gap-2" style={{ color: cat?.accent }}>
          <Icon className="w-3.5 h-3.5" strokeWidth={2} />
          <span className="lc-mincho text-xs tracking-widest">{label}</span>
        </div>
      </header>

      <div key={q.id} className="lc-paper rounded-xl p-7 sm:p-10 mb-5 lc-anim-fadeup">
        <div className="flex items-baseline gap-3 mb-5">
          <span className="lc-mincho text-2xl font-bold" style={{ color: cat?.accent }}>問</span>
          <span className="lc-mono text-xs" style={{ color: '#7d6b4f' }}>Q.{String(q.id).padStart(3, '0')}</span>
        </div>
        <h2 className="lc-mincho text-xl sm:text-2xl font-semibold leading-relaxed mb-5" style={{ color: '#1c1814' }}>
          {q.question}
        </h2>
        <div className="space-y-3 mt-7">
          {q.options.map((opt, idx) => {
            const isSel = selected === idx, isAns = idx === q.answer;
            let bg = '#fdf8eb', border = '#e3d6b8', textColor = '#1c1814';
            const badge = ['ア', 'イ', 'ウ', 'エ'][idx];
            let badgeBg = '#1c181410', badgeColor = '#1c1814';
            if (showFeedback) {
              if (isAns) { bg = '#edf3e9'; border = '#4d7c47'; badgeBg = '#4d7c47'; badgeColor = '#fff'; }
              else if (isSel) { bg = '#f7e6e6'; border = '#c1272d'; badgeBg = '#c1272d'; badgeColor = '#fff'; }
              else { textColor = '#a59682'; }
            } else if (isSel) border = '#1c1814';
            return (
              <button
                key={idx} onClick={() => handleAnswer(idx)} disabled={showFeedback}
                className={`lc-option-btn w-full text-left rounded-lg px-5 py-4 flex items-center gap-4 ${showFeedback && isSel && !isAns ? 'lc-anim-shake' : ''}`}
                style={{ background: bg, border: `1.5px solid ${border}`, color: textColor }}
              >
                <span className="lc-mincho font-bold w-8 h-8 rounded-md flex items-center justify-center shrink-0 text-sm transition-colors" style={{ background: badgeBg, color: badgeColor }}>
                  {badge}
                </span>
                <span className="lc-gothic text-base flex-1">{opt}</span>
                {showFeedback && isAns && <Check className="w-5 h-5 shrink-0" style={{ color: '#4d7c47' }} strokeWidth={2.5} />}
                {showFeedback && isSel && !isAns && <X className="w-5 h-5 shrink-0" style={{ color: '#c1272d' }} strokeWidth={2.5} />}
              </button>
            );
          })}
        </div>
      </div>

      {showFeedback && (
        <div className="lc-paper rounded-xl p-6 sm:p-8 lc-anim-fadeup">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full flex items-center justify-center lc-anim-pulse"
              style={{ background: isCorrect ? '#4d7c47' : '#c1272d', color: '#fff' }}>
              {isCorrect ? <Check className="w-5 h-5" strokeWidth={3} /> : <X className="w-5 h-5" strokeWidth={3} />}
            </div>
            <div>
              <div className="lc-mincho text-lg font-bold" style={{ color: isCorrect ? '#4d7c47' : '#c1272d' }}>
                {isCorrect ? '見事、正解' : '惜しい、不正解'}
              </div>
              <div className="lc-mincho text-xs" style={{ color: '#7d6b4f' }}>
                {isCorrect ? 'この調子で次へ' : `正解は「${['ア','イ','ウ','エ'][q.answer]}」`}
              </div>
            </div>
          </div>
          <div className="lc-divider my-4" />
          <p className="lc-gothic text-sm leading-relaxed mb-4" style={{ color: '#3d342a' }}>{q.explanation}</p>
          {q.snippet && (
            <div className="lc-snippet lc-mono text-xs sm:text-sm p-4 mb-5 overflow-x-auto whitespace-pre">{q.snippet}</div>
          )}
          <button onClick={next}
            className="w-full sm:w-auto sm:ml-auto sm:flex px-8 py-3 rounded-md flex items-center justify-center gap-2 lc-mincho font-semibold text-sm transition-all hover:translate-x-1"
            style={{ background: '#1c1814', color: '#f3ecdb' }}>
            {currentIdx < questions.length - 1 ? '次の問へ' : '結果を見る'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// 結果画面
// ─────────────────────────────────────────────
function ResultScreen({ session, progress, onHome, onRetry, onReview }) {
  const results = session.finalResults;
  const correct = results.filter(r => r.correct).length;
  const total = results.length;
  const acc = Math.round((correct / total) * 100);
  const weakCount = results.filter(r => !r.correct).length;

  let comment, commentSub, commentColor;
  if (acc === 100) { comment = '完璧'; commentSub = '一寸の隙もなし。次の章へ進もう。'; commentColor = '#4d7c47'; }
  else if (acc >= 80) { comment = '上々'; commentSub = '揺るぎない理解。あと一歩で奥義。'; commentColor = '#4d7c47'; }
  else if (acc >= 60) { comment = '善哉'; commentSub = '光が見えた。間違えた所を復習せよ。'; commentColor = '#163a5f'; }
  else if (acc >= 40) { comment = '途上'; commentSub = '足腰を鍛える時。基礎へ立ち返ろう。'; commentColor = '#7d6b4f'; }
  else { comment = '修行'; commentSub = '焦るなかれ。一問ずつ確実に。'; commentColor = '#c1272d'; }

  const r = 56, c = 2 * Math.PI * r, offset = c - (acc / 100) * c;

  const dayCompleted = session.mode === 'day';

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 sm:py-16">
      <div className="text-center mb-10 lc-anim-fadeup">
        <span className="lc-mincho text-xs tracking-[0.4em]" style={{ color: '#c1272d' }}>修練の結果</span>
        <h1 className="lc-mincho text-4xl sm:text-5xl font-bold mt-3" style={{ color: commentColor }}>{comment}</h1>
        <p className="lc-mincho text-sm mt-2" style={{ color: '#6b5d4f' }}>{commentSub}</p>
        {dayCompleted && (
          <div className="inline-flex items-center gap-1.5 mt-4 px-3 py-1 rounded-full lc-paper-flat">
            <Check className="w-3 h-3" style={{ color: '#4d7c47' }} />
            <span className="lc-mincho text-xs">Day {session.dayNum} 修了として記録</span>
          </div>
        )}
      </div>

      <div className="flex justify-center mb-10 lc-anim-scalein">
        <div className="relative">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r={r} fill="none" stroke="#1c181412" strokeWidth="8" />
            <circle cx="80" cy="80" r={r} fill="none" stroke={commentColor} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={c} strokeDashoffset={offset} transform="rotate(-90 80 80)"
              style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.2, 0.8, 0.2, 1)' }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="lc-mincho text-4xl font-bold" style={{ color: commentColor }}>{acc}<span className="text-xl">%</span></div>
            <div className="lc-mono text-xs" style={{ color: '#7d6b4f' }}>{correct} / {total}</div>
          </div>
        </div>
      </div>

      <div className="lc-paper rounded-xl p-6 mb-6 lc-anim-fadeup" style={{ animationDelay: '0.15s' }}>
        <h3 className="lc-mincho font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" style={{ color: '#163a5f' }} />振り返り
        </h3>
        <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
          {results.map((r, i) => {
            const cat = CATEGORIES.find(c => c.id === r.question.category);
            return (
              <details key={r.questionId + '-' + i} className="rounded-md transition-colors hover:bg-black/5"
                style={{ background: r.correct ? '#edf3e904' : '#f7e6e608' }}>
                <summary className="flex items-center gap-3 px-3 py-2.5 cursor-pointer">
                  <span className="lc-mono text-[10px] w-6" style={{ color: '#7d6b4f' }}>{String(i + 1).padStart(2, '0')}</span>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: r.correct ? '#4d7c47' : '#c1272d', color: '#fff' }}>
                    {r.correct ? <Check className="w-3 h-3" strokeWidth={3} /> : <X className="w-3 h-3" strokeWidth={3} />}
                  </span>
                  <span className="lc-mincho text-sm flex-1 truncate" style={{ color: '#1c1814' }}>{r.question.question}</span>
                  <span className="lc-mono text-[10px] hidden sm:inline" style={{ color: cat?.accent }}>{cat?.kanji}</span>
                </summary>
                <div className="px-3 pb-3 pt-1 ml-9">
                  <p className="lc-gothic text-xs leading-relaxed mb-2" style={{ color: '#3d342a' }}>{r.question.explanation}</p>
                  {r.question.snippet && (
                    <div className="lc-snippet lc-mono text-[11px] p-2 whitespace-pre overflow-x-auto">{r.question.snippet}</div>
                  )}
                </div>
              </details>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lc-anim-fadeup" style={{ animationDelay: '0.3s' }}>
        <button onClick={onRetry} className="lc-paper lc-card-hover rounded-lg px-5 py-4 flex items-center gap-3 lc-mincho font-semibold text-sm">
          <RotateCcw className="w-4 h-4" style={{ color: '#163a5f' }} />もう一度
        </button>
        <button onClick={onReview} disabled={progress.weakIds.length === 0}
          className={`rounded-lg px-5 py-4 flex items-center gap-3 lc-mincho font-semibold text-sm transition-all ${progress.weakIds.length > 0 ? 'lc-card-hover' : 'opacity-50 cursor-not-allowed'}`}
          style={{ background: progress.weakIds.length > 0 ? '#c1272d' : '#c1272d80', color: '#fff' }}>
          <Target className="w-4 h-4" />苦手復習 <span className="lc-mono text-xs ml-auto">{progress.weakIds.length}問</span>
        </button>
        <button onClick={onHome} className="lc-paper lc-card-hover rounded-lg px-5 py-4 flex items-center gap-3 lc-mincho font-semibold text-sm">
          <Compass className="w-4 h-4" />道場へ戻る
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 試験対策画面(ExamPrepScreen)
// ─────────────────────────────────────────────
function ExamPrepScreen({ progress, onStartFillQuiz, onStartMockExam }) {
  const goldenCount = progress.goldenIds.length;
  const goldenRate = Math.round((goldenCount / 217) * 100);
  const fillAttempted = Object.keys(progress.fillStats).length;
  const history = progress.mockHistory || [];
  const lastMock = history[history.length - 1];
  const passedCount = history.filter(h => h.passed).length;

  // 目的別の出題範囲別正解率
  const examReadinessByExam = useMemo(() => {
    const byExam = { '101': { ans: 0, cor: 0 }, '102': { ans: 0, cor: 0 } };
    Object.entries(progress.questionStats).forEach(([qid, stat]) => {
      const q = QUESTIONS.find(x => x.id === parseInt(qid));
      if (!q) return;
      q.obj.forEach(o => {
        const obj = OBJECTIVES.find(x => x.id === o);
        if (!obj) return;
        byExam[obj.exam].ans += stat.attempts;
        byExam[obj.exam].cor += stat.correct;
      });
    });
    return {
      '101': byExam['101'].ans > 0 ? Math.round(byExam['101'].cor / byExam['101'].ans * 100) : 0,
      '102': byExam['102'].ans > 0 ? Math.round(byExam['102'].cor / byExam['102'].ans * 100) : 0,
    };
  }, [progress.questionStats]);

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-10 py-8 sm:py-12">
      <header className="mb-8 lc-anim-fadeup">
        <div className="flex items-center gap-2 mb-2">
          <span className="lc-mincho text-xs tracking-[0.4em]" style={{ color: '#c1272d' }}>試験対策・本番想定</span>
        </div>
        <h1 className="lc-mincho font-bold text-3xl sm:text-4xl mb-2">本番に向けた仕上げ</h1>
        <p className="lc-mincho text-sm" style={{ color: '#6b5d4f' }}>記述式(コマ問)で精度を磨き、本試験モード(60問60分)で実戦感を養う。</p>
      </header>

      {/* 主要指標 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="lc-paper rounded-lg p-4 lc-anim-fadeup" style={{ animationDelay: '0.05s' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="lc-mincho text-xs tracking-wider" style={{ color: '#7d6b4f' }}>金メダル</span>
            <Trophy className="w-4 h-4" style={{ color: '#c1a020' }} />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="lc-mincho text-3xl font-bold" style={{ color: '#1c1814' }}>{goldenCount}</span>
            <span className="lc-mincho text-sm" style={{ color: '#7d6b4f' }}>/ 217</span>
          </div>
          <div className="lc-mincho text-[11px] mt-1" style={{ color: '#7d6b4f' }}>{goldenRate}% 完全定着</div>
        </div>
        <div className="lc-paper rounded-lg p-4 lc-anim-fadeup" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="lc-mincho text-xs tracking-wider" style={{ color: '#7d6b4f' }}>101正解率</span>
            <Hash className="w-4 h-4" style={{ color: '#163a5f' }} />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="lc-mincho text-3xl font-bold" style={{ color: '#1c1814' }}>{examReadinessByExam['101']}</span>
            <span className="lc-mincho text-sm" style={{ color: '#7d6b4f' }}>%</span>
          </div>
          <div className="lc-mincho text-[11px] mt-1" style={{ color: '#7d6b4f' }}>System Architecture 等</div>
        </div>
        <div className="lc-paper rounded-lg p-4 lc-anim-fadeup" style={{ animationDelay: '0.15s' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="lc-mincho text-xs tracking-wider" style={{ color: '#7d6b4f' }}>102正解率</span>
            <Hash className="w-4 h-4" style={{ color: '#4d7c47' }} />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="lc-mincho text-3xl font-bold" style={{ color: '#1c1814' }}>{examReadinessByExam['102']}</span>
            <span className="lc-mincho text-sm" style={{ color: '#7d6b4f' }}>%</span>
          </div>
          <div className="lc-mincho text-[11px] mt-1" style={{ color: '#7d6b4f' }}>Shell, Network, Security 等</div>
        </div>
        <div className="lc-paper rounded-lg p-4 lc-anim-fadeup" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="lc-mincho text-xs tracking-wider" style={{ color: '#7d6b4f' }}>模試受験</span>
            <Award className="w-4 h-4" style={{ color: '#c1272d' }} />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="lc-mincho text-3xl font-bold" style={{ color: '#1c1814' }}>{history.length}</span>
            <span className="lc-mincho text-sm" style={{ color: '#7d6b4f' }}>回</span>
          </div>
          <div className="lc-mincho text-[11px] mt-1" style={{ color: '#7d6b4f' }}>合格 {passedCount} 回</div>
        </div>
      </div>

      {/* 本試験モード */}
      <section className="mb-8 lc-anim-fadeup" style={{ animationDelay: '0.25s' }}>
        <h2 className="lc-mincho font-bold text-lg mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" style={{ color: '#c1272d' }} />
          本試験モード(60問・60分・合格ライン65%)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={() => onStartMockExam('101')} className="lc-paper lc-card-hover rounded-lg p-6 text-left">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-md flex items-center justify-center" style={{ background: '#163a5f18' }}>
                <span className="lc-mincho font-bold text-base" style={{ color: '#163a5f' }}>101</span>
              </div>
              <div>
                <div className="lc-mincho font-semibold">101試験 模擬</div>
                <div className="lc-mincho text-[11px]" style={{ color: '#7d6b4f' }}>System / Install / Commands / FS</div>
              </div>
            </div>
            <p className="lc-mincho text-xs leading-relaxed" style={{ color: '#6b5d4f' }}>
              101試験範囲(Topic 101-104)から60問。本番想定の60分タイマー付き。
            </p>
          </button>
          <button onClick={() => onStartMockExam('102')} className="lc-paper lc-card-hover rounded-lg p-6 text-left">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-md flex items-center justify-center" style={{ background: '#4d7c4718' }}>
                <span className="lc-mincho font-bold text-base" style={{ color: '#4d7c47' }}>102</span>
              </div>
              <div>
                <div className="lc-mincho font-semibold">102試験 模擬</div>
                <div className="lc-mincho text-[11px]" style={{ color: '#7d6b4f' }}>Shell / UI / Admin / Net / Security</div>
              </div>
            </div>
            <p className="lc-mincho text-xs leading-relaxed" style={{ color: '#6b5d4f' }}>
              102試験範囲(Topic 105-110)から60問。本番想定の60分タイマー付き。
            </p>
          </button>
          <button onClick={() => onStartMockExam('both')} className="lc-paper lc-card-hover rounded-lg p-6 text-left">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-md flex items-center justify-center" style={{ background: '#c1272d18' }}>
                <Sparkles className="w-5 h-5" style={{ color: '#c1272d' }} />
              </div>
              <div>
                <div className="lc-mincho font-semibold">統合 60問</div>
                <div className="lc-mincho text-[11px]" style={{ color: '#7d6b4f' }}>101+102 全範囲</div>
              </div>
            </div>
            <p className="lc-mincho text-xs leading-relaxed" style={{ color: '#6b5d4f' }}>
              両試験の全範囲から60問。総合力テスト用。
            </p>
          </button>
        </div>
      </section>

      {/* 記述式コマ問 */}
      <section className="mb-8 lc-anim-fadeup" style={{ animationDelay: '0.3s' }}>
        <h2 className="lc-mincho font-bold text-lg mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" style={{ color: '#5d4e7c' }} />
          記述式問題(コマ問)・スペル精度を磨く
        </h2>
        <p className="lc-mincho text-xs mb-4" style={{ color: '#7d6b4f' }}>
          本試験では選択式だけでなく、コマンド名や設定値を直接入力する記述式が約30-40%出題される。スペル違いで失点しないよう精度を上げよう。全{FILL_QUESTIONS.length}問。
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button onClick={() => onStartFillQuiz()} className="lc-paper lc-card-hover rounded-lg p-5 flex items-center gap-4 text-left">
            <div className="w-11 h-11 rounded-md flex items-center justify-center" style={{ background: '#5d4e7c18' }}>
              <FileText className="w-5 h-5" style={{ color: '#5d4e7c' }} />
            </div>
            <div className="flex-1">
              <div className="lc-mincho font-semibold">ランダム10問</div>
              <div className="lc-mincho text-xs" style={{ color: '#7d6b4f' }}>全範囲からランダム抽出</div>
            </div>
            <ChevronRight className="w-4 h-4" />
          </button>
          <button onClick={() => onStartFillQuiz(q => q.obj.startsWith('103') || q.obj.startsWith('104'))} className="lc-paper lc-card-hover rounded-lg p-5 flex items-center gap-4 text-left">
            <div className="w-11 h-11 rounded-md flex items-center justify-center" style={{ background: '#163a5f18' }}>
              <Terminal className="w-5 h-5" style={{ color: '#163a5f' }} />
            </div>
            <div className="flex-1">
              <div className="lc-mincho font-semibold">コマンド系のみ</div>
              <div className="lc-mincho text-xs" style={{ color: '#7d6b4f' }}>103.x / 104.x に絞り込み</div>
            </div>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 直近の模試履歴 */}
      {history.length > 0 && (
        <section className="lc-anim-fadeup" style={{ animationDelay: '0.4s' }}>
          <h2 className="lc-mincho font-bold text-lg mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" style={{ color: '#163a5f' }} />
            模試の歴史
          </h2>
          <div className="lc-paper rounded-xl p-5">
            <div className="space-y-2">
              {history.slice().reverse().slice(0, 10).map((h, i) => {
                const rate = Math.round(h.score / h.total * 100);
                const min = Math.floor(h.durationSec / 60);
                const sec = h.durationSec % 60;
                return (
                  <div key={i} className="flex items-center gap-3 px-2 py-2 rounded hover:bg-black/5">
                    <span className="lc-mono text-[10px] w-20" style={{ color: '#7d6b4f' }}>{h.date}</span>
                    <span className="lc-mono text-[10px] px-2 py-0.5 rounded-full" style={{ background: h.exam === '101' ? '#163a5f18' : h.exam === '102' ? '#4d7c4718' : '#c1272d18', color: h.exam === '101' ? '#163a5f' : h.exam === '102' ? '#4d7c47' : '#c1272d' }}>{h.exam}</span>
                    <span className="lc-mincho text-sm font-bold flex-1" style={{ color: h.passed ? '#4d7c47' : '#c1272d' }}>
                      {h.score} / {h.total} ({rate}%)
                    </span>
                    <span className="lc-mono text-[10px]" style={{ color: '#7d6b4f' }}>{min}:{String(sec).padStart(2, '0')}</span>
                    <span className="lc-mincho text-xs font-semibold" style={{ color: h.passed ? '#4d7c47' : '#c1272d' }}>
                      {h.passed ? '合格' : '不合格'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// 本試験モード画面(MockExamScreen)
// ─────────────────────────────────────────────
function MockExamScreen({ session, onFinish, onAbort }) {
  const [answers, setAnswers] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flagged, setFlagged] = useState(new Set());
  const [secondsLeft, setSecondsLeft] = useState(MOCK_EXAM_DURATION_SEC);
  const [showOverview, setShowOverview] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const { questions, exam } = session;
  const q = questions[currentIdx];
  const total = questions.length;
  const answered = Object.keys(answers).length;

  // タイマー
  useEffect(() => {
    if (secondsLeft <= 0) {
      // 時間切れ自動提出
      submitExam(true);
      return;
    }
    const timer = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isLowTime = secondsLeft <= 600; // 残り10分

  const submitExam = (timeOut = false) => {
    const elapsed = MOCK_EXAM_DURATION_SEC - secondsLeft;
    const results = questions.map(qq => ({
      questionId: qq.id,
      selected: answers[qq.id] ?? -1,
      correct: answers[qq.id] === qq.answer,
      question: qq,
    }));
    onFinish(results, elapsed);
  };

  const select = (idx) => {
    setAnswers({ ...answers, [q.id]: idx });
  };
  const toggleFlag = () => {
    const newFlagged = new Set(flagged);
    if (newFlagged.has(q.id)) newFlagged.delete(q.id);
    else newFlagged.add(q.id);
    setFlagged(newFlagged);
  };

  const cat = CATEGORIES.find(c => c.id === q.category);
  const Icon = cat?.icon || Terminal;

  return (
    <div className="max-w-4xl mx-auto px-6 py-6">
      {/* タイマー固定ヘッダー */}
      <div className="sticky top-0 z-30 lc-paper rounded-lg px-4 py-3 mb-5 flex items-center justify-between gap-3 lc-anim-fadeup" style={{ borderColor: isLowTime ? '#c1272d' : '#e3d6b8', borderWidth: isLowTime ? '2px' : '1px' }}>
        <div className="flex items-center gap-3">
          <button onClick={onAbort} className="lc-mincho text-xs hover:underline" style={{ color: '#7d6b4f' }}>
            中断
          </button>
          <span className="lc-mono text-[10px] px-2 py-0.5 rounded-full" style={{ background: '#c1272d18', color: '#c1272d' }}>本試験 {exam === 'both' ? '統合' : exam}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className={`w-4 h-4 ${isLowTime ? 'lc-anim-blink' : ''}`} style={{ color: isLowTime ? '#c1272d' : '#1c1814' }} />
          <span className="lc-mono text-xl font-bold" style={{ color: isLowTime ? '#c1272d' : '#1c1814' }}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="lc-mono text-[11px]" style={{ color: '#7d6b4f' }}>解答 <span className="font-bold" style={{ color: '#163a5f' }}>{answered}</span> / {total}</span>
          <button onClick={() => setShowOverview(!showOverview)} className="lc-mincho text-xs px-2 py-1 rounded hover:bg-black/5" style={{ color: '#1c1814' }}>
            一覧
          </button>
        </div>
      </div>

      {/* 一覧パネル */}
      {showOverview && (
        <div className="lc-paper rounded-lg p-4 mb-5 lc-anim-fadein">
          <div className="flex items-center justify-between mb-3">
            <h3 className="lc-mincho font-bold text-sm">解答状況の一覧</h3>
            <button onClick={() => setShowOverview(false)} className="lc-mincho text-xs hover:underline" style={{ color: '#7d6b4f' }}>閉じる</button>
          </div>
          <div className="grid grid-cols-10 sm:grid-cols-15 gap-1">
            {questions.map((qq, idx) => {
              const isAnswered = answers[qq.id] !== undefined;
              const isFlagged = flagged.has(qq.id);
              const isCurrent = idx === currentIdx;
              return (
                <button key={qq.id} onClick={() => { setCurrentIdx(idx); setShowOverview(false); }}
                  className="lc-cell aspect-square rounded text-[10px] lc-mono font-bold flex items-center justify-center relative"
                  style={{
                    background: isCurrent ? '#1c1814' : isAnswered ? '#4d7c47' : '#1c181410',
                    color: isCurrent || isAnswered ? '#fff' : '#7d6b4f',
                  }}>
                  {idx + 1}
                  {isFlagged && <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full" style={{ background: '#c1272d' }} />}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex items-center gap-3 text-[10px] lc-mono" style={{ color: '#7d6b4f' }}>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm" style={{ background: '#4d7c47' }} />解答済</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm" style={{ background: '#1c181410' }} />未解答</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full" style={{ background: '#c1272d' }} />要確認</span>
          </div>
        </div>
      )}

      {/* 進捗バー */}
      <div className="h-1 w-full rounded-full overflow-hidden mb-5" style={{ background: '#1c181410' }}>
        <div className="h-full transition-all duration-500" style={{ width: `${((currentIdx + 1) / total) * 100}%`, background: cat?.accent || '#163a5f' }} />
      </div>

      {/* 問題本体 */}
      <div className="lc-paper rounded-xl p-7 sm:p-9 mb-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2" style={{ color: cat?.accent }}>
            <Icon className="w-3.5 h-3.5" strokeWidth={2} />
            <span className="lc-mincho text-xs tracking-widest">{cat?.name}</span>
            <span className="lc-mono text-[10px]" style={{ color: '#7d6b4f' }}>obj: {q.obj.join(', ')}</span>
          </div>
          <button onClick={toggleFlag} className="text-xs px-2 py-1 rounded lc-mincho hover:bg-black/5" style={{ color: flagged.has(q.id) ? '#c1272d' : '#7d6b4f' }}>
            {flagged.has(q.id) ? '★ 要確認' : '☆ 後で見直し'}
          </button>
        </div>
        <div className="flex items-baseline gap-3 mb-5">
          <span className="lc-mincho text-2xl font-bold" style={{ color: cat?.accent }}>問</span>
          <span className="lc-mono text-xs" style={{ color: '#7d6b4f' }}>{currentIdx + 1} / {total}</span>
        </div>
        <h2 className="lc-mincho text-xl sm:text-2xl font-semibold leading-relaxed mb-5" style={{ color: '#1c1814' }}>
          {q.question}
        </h2>
        <div className="space-y-3 mt-7">
          {q.options.map((opt, idx) => {
            const isSel = answers[q.id] === idx;
            const badge = ['ア', 'イ', 'ウ', 'エ'][idx];
            return (
              <button key={idx} onClick={() => select(idx)}
                className="lc-option-btn w-full text-left rounded-lg px-5 py-4 flex items-center gap-4"
                style={{ background: '#fdf8eb', border: `1.5px solid ${isSel ? '#1c1814' : '#e3d6b8'}`, color: '#1c1814' }}>
                <span className="lc-mincho font-bold w-8 h-8 rounded-md flex items-center justify-center shrink-0 text-sm" style={{ background: isSel ? '#1c1814' : '#1c181410', color: isSel ? '#fff' : '#1c1814' }}>
                  {badge}
                </span>
                <span className="lc-gothic text-base flex-1">{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ナビゲーション */}
      <div className="flex items-center justify-between gap-2">
        <button onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))} disabled={currentIdx === 0}
          className="lc-paper rounded-md px-4 py-2 lc-mincho text-sm flex items-center gap-2 disabled:opacity-40">
          <ArrowLeft className="w-4 h-4" />前へ
        </button>
        {currentIdx === total - 1 ? (
          <button onClick={() => setConfirmSubmit(true)} className="px-6 py-2 rounded-md lc-mincho font-semibold text-sm" style={{ background: '#c1272d', color: '#fff' }}>
            解答を提出
          </button>
        ) : (
          <button onClick={() => setCurrentIdx(currentIdx + 1)} className="lc-paper rounded-md px-4 py-2 lc-mincho text-sm flex items-center gap-2">
            次へ<ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 提出確認モーダル */}
      {confirmSubmit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40 lc-anim-fadein" onClick={() => setConfirmSubmit(false)}>
          <div className="lc-paper rounded-xl p-6 max-w-md mx-4 lc-anim-scalein" onClick={e => e.stopPropagation()}>
            <h3 className="lc-mincho font-bold text-lg mb-3">解答を提出しますか?</h3>
            <p className="lc-mincho text-sm mb-4" style={{ color: '#3d342a' }}>
              <span className="lc-mono font-bold" style={{ color: '#163a5f' }}>{answered}</span> / {total} 問に解答済み。残り <span className="lc-mono font-bold">{total - answered}</span> 問は未解答(誤りとして扱われます)です。
            </p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setConfirmSubmit(false)} className="px-4 py-2 rounded lc-mincho text-sm hover:bg-black/5" style={{ color: '#7d6b4f' }}>戻る</button>
              <button onClick={() => submitExam(false)} className="px-5 py-2 rounded lc-mincho font-semibold text-sm" style={{ background: '#c1272d', color: '#fff' }}>提出する</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// 本試験 結果画面(MockResultScreen)
// ─────────────────────────────────────────────
function MockResultScreen({ session, progress, onHome, onRetry }) {
  const results = session.finalResults;
  const correct = results.filter(r => r.correct).length;
  const total = results.length;
  const acc = Math.round((correct / total) * 100);
  const passed = acc >= MOCK_EXAM_PASS_LINE * 100;
  const min = Math.floor(session.durationSec / 60);
  const sec = session.durationSec % 60;

  // 出題範囲別正解率
  const byTopic = useMemo(() => {
    const map = {};
    results.forEach(r => {
      const topic = r.question.obj[0]?.split('.')[0]; // "103.4" → "103"
      if (!topic) return;
      if (!map[topic]) map[topic] = { ans: 0, cor: 0 };
      map[topic].ans += 1;
      if (r.correct) map[topic].cor += 1;
    });
    return Object.entries(map).map(([id, v]) => ({
      id, ans: v.ans, cor: v.cor, rate: Math.round(v.cor / v.ans * 100)
    })).sort((a, b) => a.id.localeCompare(b.id));
  }, [results]);

  const r = 56, c = 2 * Math.PI * r, offset = c - (acc / 100) * c;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 sm:py-16">
      <div className="text-center mb-10 lc-anim-fadeup">
        <span className="lc-mincho text-xs tracking-[0.4em]" style={{ color: '#c1272d' }}>本試験モード・結果</span>
        <h1 className="lc-mincho text-4xl sm:text-5xl font-bold mt-3" style={{ color: passed ? '#4d7c47' : '#c1272d' }}>
          {passed ? '合格' : '不合格'}
        </h1>
        <p className="lc-mincho text-sm mt-2" style={{ color: '#6b5d4f' }}>
          {passed ? '本試験でも合格圏。あとは記述式の精度を磨いて万全に。' : `合格ラインは ${Math.round(MOCK_EXAM_PASS_LINE * 100)}%。あと ${Math.max(0, Math.ceil(MOCK_EXAM_PASS_LINE * total) - correct)} 問の正解で合格圏。`}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="lc-paper rounded-xl p-6 flex flex-col items-center justify-center lc-anim-scalein">
          <div className="relative">
            <svg width="140" height="140" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r={r} fill="none" stroke="#1c181412" strokeWidth="8" />
              <circle cx="80" cy="80" r={r} fill="none" stroke={passed ? '#4d7c47' : '#c1272d'} strokeWidth="8" strokeLinecap="round"
                strokeDasharray={c} strokeDashoffset={offset} transform="rotate(-90 80 80)"
                style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.2, 0.8, 0.2, 1)' }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="lc-mincho text-3xl font-bold" style={{ color: passed ? '#4d7c47' : '#c1272d' }}>{acc}%</div>
              <div className="lc-mono text-xs" style={{ color: '#7d6b4f' }}>{correct} / {total}</div>
            </div>
          </div>
        </div>
        <div className="lc-paper rounded-xl p-6 flex flex-col justify-center lc-anim-fadeup" style={{ animationDelay: '0.1s' }}>
          <div className="lc-mincho text-xs mb-2" style={{ color: '#7d6b4f' }}>所要時間</div>
          <div className="lc-mono text-3xl font-bold" style={{ color: '#163a5f' }}>
            {String(min).padStart(2, '0')}:{String(sec).padStart(2, '0')}
          </div>
          <div className="lc-mincho text-[11px] mt-1" style={{ color: '#7d6b4f' }}>
            制限時間 60分 / 残 {Math.floor((MOCK_EXAM_DURATION_SEC - session.durationSec) / 60)}分
          </div>
          <div className="lc-mincho text-[11px] mt-2" style={{ color: '#7d6b4f' }}>
            1問あたり <span className="lc-mono font-bold">{Math.round(session.durationSec / total)}</span> 秒
          </div>
        </div>
        <div className="lc-paper rounded-xl p-6 flex flex-col justify-center lc-anim-fadeup" style={{ animationDelay: '0.15s' }}>
          <div className="lc-mincho text-xs mb-2" style={{ color: '#7d6b4f' }}>判定</div>
          <div className="lc-mincho text-2xl font-bold" style={{ color: passed ? '#4d7c47' : '#c1272d' }}>
            合格ライン{Math.round(MOCK_EXAM_PASS_LINE * 100)}%
          </div>
          <div className="lc-mincho text-[11px] mt-2 leading-relaxed" style={{ color: '#3d342a' }}>
            {passed
              ? '本試験は表記揺れや記述式での失点も考慮し、80%以上を安定圏として目指そう。'
              : '間違えた問題を「自由稽古」で復習し、再挑戦しよう。'}
          </div>
        </div>
      </div>

      {/* 出題範囲別正解率 */}
      <div className="lc-paper rounded-xl p-6 mb-6 lc-anim-fadeup" style={{ animationDelay: '0.2s' }}>
        <h3 className="lc-mincho font-bold text-lg mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" style={{ color: '#163a5f' }} />
          出題範囲別の正解率
        </h3>
        <div className="space-y-2">
          {byTopic.map((t, i) => {
            const topic = TOPICS_LPIC[t.id];
            const tColor = t.rate >= 75 ? '#4d7c47' : t.rate >= 50 ? '#163a5f' : '#c1272d';
            return (
              <div key={t.id} className="flex items-center gap-3 lc-anim-fadeup" style={{ animationDelay: `${0.25 + i * 0.04}s` }}>
                <span className="lc-mono text-xs w-12" style={{ color: '#7d6b4f' }}>{t.id}</span>
                <span className="lc-mincho text-sm flex-1 truncate">{topic || ''}</span>
                <div className="flex-1 max-w-32 h-2 rounded-full overflow-hidden" style={{ background: '#1c181408' }}>
                  <div className="h-full lc-bar-fill" style={{ width: `${t.rate}%`, background: tColor }} />
                </div>
                <span className="lc-mono text-xs w-16 text-right" style={{ color: tColor }}>
                  <span className="font-bold">{t.cor}/{t.ans}</span>
                </span>
                <span className="lc-mono text-xs w-12 text-right font-bold" style={{ color: tColor }}>{t.rate}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 振り返り */}
      <details className="lc-paper rounded-xl p-6 mb-6 lc-anim-fadeup" style={{ animationDelay: '0.3s' }}>
        <summary className="cursor-pointer lc-mincho font-bold text-lg flex items-center gap-2">
          <BookOpen className="w-5 h-5" style={{ color: '#7d6b4f' }} />
          全60問の振り返り(クリックで展開)
        </summary>
        <div className="space-y-2 mt-4 max-h-96 overflow-y-auto pr-2">
          {results.map((r, i) => (
            <details key={r.questionId + '-' + i} className="rounded-md transition-colors hover:bg-black/5"
              style={{ background: r.correct ? '#edf3e904' : '#f7e6e608' }}>
              <summary className="flex items-center gap-3 px-3 py-2 cursor-pointer">
                <span className="lc-mono text-[10px] w-6" style={{ color: '#7d6b4f' }}>{String(i + 1).padStart(2, '0')}</span>
                <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: r.correct ? '#4d7c47' : '#c1272d', color: '#fff' }}>
                  {r.correct ? <Check className="w-3 h-3" strokeWidth={3} /> : <X className="w-3 h-3" strokeWidth={3} />}
                </span>
                <span className="lc-mincho text-sm flex-1 truncate">{r.question.question}</span>
                <span className="lc-mono text-[9px]" style={{ color: '#7d6b4f' }}>{r.question.obj[0]}</span>
              </summary>
              <div className="px-3 pb-3 pt-1 ml-9">
                <p className="lc-gothic text-xs leading-relaxed mb-2" style={{ color: '#3d342a' }}>{r.question.explanation}</p>
                {r.question.snippet && (
                  <div className="lc-snippet lc-mono text-[11px] p-2 whitespace-pre overflow-x-auto">{r.question.snippet}</div>
                )}
              </div>
            </details>
          ))}
        </div>
      </details>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lc-anim-fadeup" style={{ animationDelay: '0.4s' }}>
        <button onClick={onRetry} className="lc-paper lc-card-hover rounded-lg px-5 py-4 flex items-center justify-center gap-3 lc-mincho font-semibold text-sm">
          <RotateCcw className="w-4 h-4" style={{ color: '#163a5f' }} />もう一度受験
        </button>
        <button onClick={onHome} className="lc-paper lc-card-hover rounded-lg px-5 py-4 flex items-center justify-center gap-3 lc-mincho font-semibold text-sm">
          <Compass className="w-4 h-4" />道場へ戻る
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 記述式画面(FillQuizScreen)
// ─────────────────────────────────────────────
function FillQuizScreen({ session, onFinish, onExit }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [results, setResults] = useState([]);
  const { questions } = session;
  const q = questions[currentIdx];
  const total = questions.length;
  const progress = ((currentIdx + (showFeedback ? 1 : 0)) / total) * 100;

  const normalize = (s) => s.trim().replace(/\s+/g, ' ');
  const isCorrect = useMemo(() => {
    if (!showFeedback) return null;
    const u = normalize(userInput);
    if (u === normalize(q.expectedAnswer)) return true;
    return q.alternates.some(a => normalize(a) === u);
  }, [showFeedback, userInput, q]);

  const submit = () => {
    if (!userInput.trim() || showFeedback) return;
    setShowFeedback(true);
    const u = normalize(userInput);
    const correct = u === normalize(q.expectedAnswer) || q.alternates.some(a => normalize(a) === u);
    setResults(prev => [...prev, { questionId: q.id, userInput, correct, question: q }]);
  };

  const next = () => {
    if (currentIdx < total - 1) {
      setCurrentIdx(currentIdx + 1);
      setUserInput('');
      setShowFeedback(false);
      setShowHint(false);
    } else {
      onFinish(results);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 sm:py-12">
      <header className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onExit} className="flex items-center gap-2 lc-mincho text-sm hover:opacity-70" style={{ color: '#6b5d4f' }}>
            <ArrowLeft className="w-4 h-4" />やめる
          </button>
          <span className="lc-mono text-xs" style={{ color: '#7d6b4f' }}>
            {String(currentIdx + 1).padStart(2, '0')} <span style={{ opacity: 0.4 }}>/ {String(total).padStart(2, '0')}</span>
          </span>
        </div>
        <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: '#1c181410' }}>
          <div className="h-full transition-all duration-500" style={{ width: `${progress}%`, background: '#5d4e7c' }} />
        </div>
        <div className="mt-4 flex items-center gap-2" style={{ color: '#5d4e7c' }}>
          <FileText className="w-3.5 h-3.5" strokeWidth={2} />
          <span className="lc-mincho text-xs tracking-widest">記述式・スペル精度を磨く</span>
          <span className="lc-mono text-[10px] ml-auto" style={{ color: '#7d6b4f' }}>obj: {q.obj}</span>
        </div>
      </header>

      <div key={q.id} className="lc-paper rounded-xl p-7 sm:p-9 mb-5 lc-anim-fadeup">
        <div className="flex items-baseline gap-3 mb-5">
          <span className="lc-mincho text-2xl font-bold" style={{ color: '#5d4e7c' }}>記</span>
          <span className="lc-mono text-xs" style={{ color: '#7d6b4f' }}>{q.id}</span>
        </div>
        <h2 className="lc-mincho text-lg sm:text-xl font-semibold leading-relaxed mb-6 whitespace-pre-wrap" style={{ color: '#1c1814' }}>
          {q.prompt}
        </h2>
        <div className="mb-3">
          <input
            type="text"
            value={userInput}
            onChange={(e) => !showFeedback && setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !showFeedback && submit()}
            disabled={showFeedback}
            autoFocus
            placeholder="ここに入力(Enterキーで送信)"
            className="w-full lc-mono text-base rounded-lg px-4 py-3 outline-none"
            style={{
              background: showFeedback ? (isCorrect ? '#edf3e9' : '#f7e6e6') : '#fdf8eb',
              border: `2px solid ${showFeedback ? (isCorrect ? '#4d7c47' : '#c1272d') : '#e3d6b8'}`,
              color: '#1c1814',
            }}
          />
        </div>

        {!showFeedback && (
          <div className="flex items-center justify-between mt-4">
            <button onClick={() => setShowHint(!showHint)} className="lc-mincho text-xs hover:underline flex items-center gap-1" style={{ color: '#7d6b4f' }}>
              <Lightbulb className="w-3 h-3" />
              {showHint ? 'ヒントを閉じる' : 'ヒントを見る'}
            </button>
            <button onClick={submit} disabled={!userInput.trim()}
              className="px-6 py-2 rounded-md lc-mincho font-semibold text-sm transition-all disabled:opacity-40"
              style={{ background: '#1c1814', color: '#f3ecdb' }}>
              解答する
            </button>
          </div>
        )}
        {showHint && !showFeedback && (
          <div className="mt-3 px-4 py-2 rounded-md lc-anim-fadein" style={{ background: '#fff5d4', border: '1px solid #f0d97a' }}>
            <p className="lc-mincho text-xs" style={{ color: '#7d6b4f' }}>
              <span className="font-bold">ヒント:</span> {q.hint}
            </p>
          </div>
        )}
      </div>

      {showFeedback && (
        <div className="lc-paper rounded-xl p-6 sm:p-8 lc-anim-fadeup">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full flex items-center justify-center lc-anim-pulse"
              style={{ background: isCorrect ? '#4d7c47' : '#c1272d', color: '#fff' }}>
              {isCorrect ? <Check className="w-5 h-5" strokeWidth={3} /> : <X className="w-5 h-5" strokeWidth={3} />}
            </div>
            <div>
              <div className="lc-mincho text-lg font-bold" style={{ color: isCorrect ? '#4d7c47' : '#c1272d' }}>
                {isCorrect ? '見事、正解' : '惜しい、不正解'}
              </div>
              <div className="lc-mincho text-xs" style={{ color: '#7d6b4f' }}>
                {isCorrect ? 'スペル精度OK。次へ' : '正解は下記。スペル間違いに要注意'}
              </div>
            </div>
          </div>
          {!isCorrect && (
            <div className="mb-4 px-4 py-3 rounded-md lc-paper-flat">
              <div className="lc-mincho text-[11px] mb-1" style={{ color: '#7d6b4f' }}>あなたの解答</div>
              <div className="lc-mono text-sm mb-2" style={{ color: '#c1272d' }}>{userInput || '(未入力)'}</div>
              <div className="lc-mincho text-[11px] mb-1" style={{ color: '#7d6b4f' }}>正解</div>
              <div className="lc-mono text-sm font-bold" style={{ color: '#4d7c47' }}>{q.expectedAnswer}</div>
              {q.alternates && q.alternates.length > 0 && (
                <>
                  <div className="lc-mincho text-[11px] mt-2 mb-1" style={{ color: '#7d6b4f' }}>別解として認められる例</div>
                  <div className="lc-mono text-[11px]" style={{ color: '#7d6b4f' }}>
                    {q.alternates.slice(0, 3).join('  /  ')}
                  </div>
                </>
              )}
            </div>
          )}
          <div className="lc-divider my-4" />
          <p className="lc-gothic text-sm leading-relaxed mb-4" style={{ color: '#3d342a' }}>{q.explanation}</p>
          <button onClick={next}
            className="w-full sm:w-auto sm:ml-auto sm:flex px-8 py-3 rounded-md flex items-center justify-center gap-2 lc-mincho font-semibold text-sm transition-all hover:translate-x-1"
            style={{ background: '#1c1814', color: '#f3ecdb' }}>
            {currentIdx < total - 1 ? '次の問へ' : '結果を見る'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

// LPICトピック名のマップ(出題範囲別正解率の表示用)
const TOPICS_LPIC = {
  '101': 'システムアーキテクチャ',
  '102': 'インストール・パッケージ管理',
  '103': 'GNU/Unixコマンド',
  '104': 'デバイス・FS・FHS',
  '105': 'シェルとスクリプト',
  '106': 'UI・デスクトップ',
  '107': '管理業務',
  '108': '重要なシステムサービス',
  '109': 'ネットワークの基礎',
  '110': 'セキュリティ',
};

// ─────────────────────────────────────────────
// ログイン画面
// ─────────────────────────────────────────────
function LoginScreen({ styleBlock }) {
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    setSigningIn(true);
    setError('');
    try {
      await signInWithGoogle();
      // 成功後は subscribeAuth が user を検知して自動的に画面遷移
    } catch (e) {
      console.error('ログイン失敗:', e);
      if (e.code === 'auth/popup-closed-by-user') {
        setError('');  // ユーザがキャンセルした場合はエラー表示しない
      } else if (e.code === 'auth/unauthorized-domain') {
        setError('このドメインは認証許可リストに含まれていません。Firebase コンソールの「Authentication > Settings > 承認済みドメイン」に追加してください。');
      } else {
        setError('ログインに失敗しました。しばらくしてから再度お試しください。');
      }
      setSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen lc-bg lc-gothic flex items-center justify-center px-6">
      <style>{styleBlock}</style>
      <div className="lc-paper rounded-2xl p-8 sm:p-12 max-w-md w-full lc-anim-scalein">
        <div className="text-center mb-8">
          <div className="lc-mincho text-xs tracking-[0.4em] mb-3" style={{ color: '#c1272d' }}>言の葉道場</div>
          <h1 className="lc-mincho font-bold text-3xl sm:text-4xl mb-3" style={{ color: '#1c1814' }}>
            言の葉<span className="lc-mono mx-2 text-xl" style={{ color: '#7d6b4f' }}>×</span>LPIC
          </h1>
          <p className="lc-mincho text-sm" style={{ color: '#6b5d4f' }}>
            LPICレベル1合格に向けた、能動学習アプリ
          </p>
        </div>

        <div className="lc-divider mb-8" />

        <div className="mb-6">
          <p className="lc-mincho text-sm leading-relaxed" style={{ color: '#3d342a' }}>
            Google アカウントでログインすると、PC・スマートフォン・タブレットなど、どの端末からでも同じ進捗で学習を続けられます。
          </p>
        </div>

        <button
          onClick={handleSignIn}
          disabled={signingIn}
          className="w-full px-6 py-3 rounded-lg flex items-center justify-center gap-3 lc-mincho font-semibold transition-all hover:translate-y-[-1px] hover:shadow-lg disabled:opacity-50"
          style={{ background: '#1c1814', color: '#f3ecdb' }}
        >
          {signingIn ? (
            <>
              <span className="lc-anim-blink">●</span>
              <span>ログイン中...</span>
            </>
          ) : (
            <>
              {/* Google ロゴ SVG */}
              <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
                <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.547 0 9s.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              <span>Google でログイン</span>
            </>
          )}
        </button>

        {error && (
          <div className="mt-4 px-4 py-3 rounded-md text-xs lc-mincho lc-anim-fadein" style={{ background: '#f7e6e6', color: '#c1272d', border: '1px solid #e8b8b8' }}>
            {error}
          </div>
        )}

        <div className="mt-8 lc-mincho text-[11px] leading-relaxed" style={{ color: '#7d6b4f' }}>
          <p className="mb-1">● ログイン情報は Google 側で管理され、本アプリでは Google アカウントのIDのみ使用します。</p>
          <p className="mb-1">● 学習進捗は Firebase のクラウドストレージに保存されます。</p>
          <p>● 別の Google アカウントでログインすると別の進捗データになります(統合不可)。</p>
        </div>
      </div>
    </div>
  );
}

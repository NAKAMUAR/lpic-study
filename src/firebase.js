// ─────────────────────────────────────────────
// Firebase 初期化と Auth / Firestore のエクスポート
// ─────────────────────────────────────────────
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  enableIndexedDbPersistence,
} from 'firebase/firestore';

// linux-learning プロジェクト用の設定
const firebaseConfig = {
  apiKey: 'AIzaSyCFopTBCgcfVEnf3IBjkgvOUvzJwGfKK8Y',
  authDomain: 'linux-learning-77a66.firebaseapp.com',
  projectId: 'linux-learning-77a66',
  storageBucket: 'linux-learning-77a66.firebasestorage.app',
  messagingSenderId: '961364567548',
  appId: '1:961364567548:web:176f4e926decd109e7be79',
};

// アプリ初期化
const app = initializeApp(firebaseConfig);

// Auth と Firestore のインスタンス
export const auth = getAuth(app);
export const db = getFirestore(app);

// オフライン永続化を有効化(オフラインでも動作 / 復帰時に自動同期)
// 注: 複数タブで同時起動時はエラーが出るが致命的ではないので無視してOK
try {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('[Firebase] 複数タブで開かれているため、オフライン同期は最初のタブのみ有効です');
    } else if (err.code === 'unimplemented') {
      console.warn('[Firebase] このブラウザはオフライン同期に対応していません');
    }
  });
} catch (e) {
  // 古いブラウザ等で失敗しても致命的ではないので継続
  console.warn('[Firebase] オフライン永続化の有効化に失敗:', e);
}

// Google ログインプロバイダ
const googleProvider = new GoogleAuthProvider();

// ─────────────────────────────────────────────
// 認証関連のヘルパー関数
// ─────────────────────────────────────────────
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signOut = () => firebaseSignOut(auth);
export const subscribeAuth = (callback) => onAuthStateChanged(auth, callback);

// ─────────────────────────────────────────────
// Firestore 進捗データ操作
// ユーザごとに /users/{uid} ドキュメントに保存
// ─────────────────────────────────────────────

/**
 * ユーザの進捗データを取得(初回起動時に使用)
 */
export const loadUserProgress = async (uid) => {
  if (!uid) return null;
  try {
    const ref = doc(db, 'users', uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return snap.data();
    }
    return null; // 初回ログイン時は空
  } catch (e) {
    console.error('[Firestore] 読み込み失敗:', e);
    return null;
  }
};

/**
 * ユーザの進捗データを保存
 */
export const saveUserProgress = async (uid, progress) => {
  if (!uid) return;
  try {
    const ref = doc(db, 'users', uid);
    await setDoc(ref, progress, { merge: false });
  } catch (e) {
    console.error('[Firestore] 保存失敗:', e);
  }
};

/**
 * リアルタイム同期: 他端末での変更を即座に反映
 * 戻り値はサブスクリプション解除関数
 */
export const subscribeUserProgress = (uid, callback) => {
  if (!uid) return () => {};
  const ref = doc(db, 'users', uid);
  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        // ローカルからの変更ではなくサーバ側の変更のみ拾う
        if (!snap.metadata.hasPendingWrites) {
          callback(snap.data());
        }
      }
    },
    (err) => {
      console.error('[Firestore] リアルタイム同期エラー:', err);
    }
  );
};

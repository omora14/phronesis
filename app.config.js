import 'dotenv/config';

export default {
  expo: {
    name: 'phronesis',
    slug: 'phronesis',
    extra: {
      firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    },
  },
};

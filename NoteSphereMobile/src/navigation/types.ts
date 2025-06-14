import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabsParamList = {
  Home: undefined;
  Search: undefined;
  AddNote: undefined;
  Repositories: undefined;
  Profile: undefined;
};

export type MainStackParamList = {
  Main: NavigatorScreenParams<MainTabsParamList>;
  Note: { noteId: string };
  Repository: { repositoryId: string };
  Collaborators: { repositoryId: string };
  Profile: { userId: string };
  AddNote: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 
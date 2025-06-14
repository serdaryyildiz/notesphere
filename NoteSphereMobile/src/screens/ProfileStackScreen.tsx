import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import ProfileScreen from './ProfileScreen';

type Props = NativeStackScreenProps<MainStackParamList, 'Profile'>;

const ProfileStackScreen = (props: Props) => {
  return <ProfileScreen {...props} />;
};

export default ProfileStackScreen; 
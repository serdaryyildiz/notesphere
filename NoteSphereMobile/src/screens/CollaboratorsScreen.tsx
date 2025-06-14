import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { COLORS, FONTS, SIZES } from '../utils/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';

type CollaboratorsScreenProps = Partial<NativeStackScreenProps<MainStackParamList, 'Collaborators'>>;

const CollaboratorsScreen: React.FC<CollaboratorsScreenProps> = ({ route }) => {
  return (
    <View style={styles.container}>
      <Text>Collaborators Screen (Coming Soon)</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});

export default CollaboratorsScreen; 
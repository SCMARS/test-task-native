import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Menu } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Category, DEFAULT_CATEGORIES } from '../types/expense';

interface ExpenseFilterProps {
  startDate: Date | null;
  endDate: Date | null;
  category: string | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  onCategoryChange: (category: string | null) => void;
  onReset: () => void;
}

export const ExpenseFilter: React.FC<ExpenseFilterProps> = ({
  startDate,
  endDate,
  category,
  onStartDateChange,
  onEndDateChange,
  onCategoryChange,
  onReset
}) => {
  const [showStartDatePicker, setShowStartDatePicker] = React.useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = React.useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = React.useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Button
          mode="outlined"
          onPress={() => setShowStartDatePicker(true)}
          style={styles.dateButton}
        >
          {startDate ? startDate.toLocaleDateString() : 'Start Date'}
        </Button>

        <Button
          mode="outlined"
          onPress={() => setShowEndDatePicker(true)}
          style={styles.dateButton}
        >
          {endDate ? endDate.toLocaleDateString() : 'End Date'}
        </Button>
      </View>

      <Menu
        visible={showCategoryMenu}
        onDismiss={() => setShowCategoryMenu(false)}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setShowCategoryMenu(true)}
            style={styles.categoryButton}
          >
            {category || 'All Categories'}
          </Button>
        }
      >
        <Menu.Item
          onPress={() => {
            onCategoryChange(null);
            setShowCategoryMenu(false);
          }}
          title="All Categories"
        />
        {DEFAULT_CATEGORIES.map((cat) => (
          <Menu.Item
            key={cat.id}
            onPress={() => {
              onCategoryChange(cat.id);
              setShowCategoryMenu(false);
            }}
            title={cat.name}
          />
        ))}
      </Menu>

      <Button
        mode="contained"
        onPress={onReset}
        style={styles.resetButton}
      >
        Reset Filters
      </Button>

      {showStartDatePicker && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowStartDatePicker(false);
            if (selectedDate) {
              onStartDateChange(selectedDate);
            }
          }}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowEndDatePicker(false);
            if (selectedDate) {
              onEndDateChange(selectedDate);
            }
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  categoryButton: {
    marginBottom: 16,
  },
  resetButton: {
    marginTop: 8,
  },
}); 
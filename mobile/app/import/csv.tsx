import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { colors, typography, spacing } from '@theme';
import { Card, Button, Input } from '@components';
import api from '@services/api';
import { useAccounts } from '@hooks/useAccounts';

interface CSVPreview {
  columns: string[];
  sample_rows: Record<string, string>[];
  total_rows: number;
}

interface ColumnMapping {
  date: string;
  description: string;
  amount: string;
  category?: string;
  account?: string;
  notes?: string;
}

export default function CSVImportScreen() {
  const router = useRouter();
  const { data: accounts } = useAccounts();

  const [step, setStep] = useState<'upload' | 'preview' | 'mapping' | 'import'>('upload');
  const [csvFile, setCSVFile] = useState<any>(null);
  const [preview, setPreview] = useState<CSVPreview | null>(null);
  const [mapping, setMapping] = useState<ColumnMapping>({
    date: '',
    description: '',
    amount: '',
  });
  const [config, setConfig] = useState({
    account_id: accounts?.[0]?.id || 0,
    date_format: '%Y-%m-%d',
    skip_duplicates: true,
    amount_multiplier: 1.0,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Pick and preview CSV file
  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/comma-separated-values',
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      setCSVFile(file);

      // Preview the file
      await previewCSV(file);
    } catch (error) {
      Alert.alert('Error', 'Failed to pick file');
    }
  };

  const previewCSV = async (file: any) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: 'text/csv',
        name: file.name,
      } as any);

      const response = await api.post('/csv-import/preview', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setPreview(response.data.preview);
        setStep('preview');

        // Auto-detect common column names
        const columns = response.data.preview.columns;
        const autoMapping: ColumnMapping = {
          date: findColumn(columns, ['date', 'transaction date', 'posted date']),
          description: findColumn(columns, ['description', 'memo', 'payee', 'merchant']),
          amount: findColumn(columns, ['amount', 'transaction amount', 'value']),
          category: findColumn(columns, ['category', 'type']),
          account: findColumn(columns, ['account', 'account name']),
          notes: findColumn(columns, ['notes', 'memo', 'comment']),
        };
        setMapping(autoMapping);
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to preview CSV');
    } finally {
      setIsLoading(false);
    }
  };

  const findColumn = (columns: string[], searchTerms: string[]): string => {
    const column = columns.find((col) =>
      searchTerms.some((term) => col.toLowerCase().includes(term.toLowerCase()))
    );
    return column || '';
  };

  // Step 2: Configure column mapping
  const handleContinueToMapping = () => {
    setStep('mapping');
  };

  // Step 3: Import transactions
  const handleImport = async () => {
    // Validate required mappings
    if (!mapping.date || !mapping.description || !mapping.amount) {
      Alert.alert('Error', 'Please map Date, Description, and Amount columns');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: csvFile.uri,
        type: 'text/csv',
        name: csvFile.name,
      } as any);
      formData.append('mapping', JSON.stringify(mapping));
      formData.append('config', JSON.stringify(config));

      const response = await api.post('/csv-import/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const { imported, skipped, errors } = response.data;

        Alert.alert(
          'Import Complete',
          `Imported: ${imported}\nSkipped: ${skipped}\nErrors: ${errors}`,
          [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to import transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const renderUploadStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <Text style={styles.iconLarge}>📄</Text>
      </View>

      <Text style={styles.stepTitle}>Import from CSV</Text>
      <Text style={styles.stepDescription}>
        Upload a CSV file containing your transactions. We'll help you map the columns.
      </Text>

      <Button
        title="Choose CSV File"
        onPress={handlePickFile}
        icon="📂"
        fullWidth
        style={styles.button}
      />

      <Card variant="glass" style={styles.infoCard}>
        <Text style={styles.infoTitle}>Supported Formats</Text>
        <Text style={styles.infoText}>• CSV files (.csv)</Text>
        <Text style={styles.infoText}>• Common bank export formats</Text>
        <Text style={styles.infoText}>• Required: Date, Description, Amount</Text>
      </Card>

      <TouchableOpacity onPress={() => Alert.alert('Coming soon', 'Download template')}>
        <Text style={styles.linkText}>Download Example Template</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPreviewStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Preview Data</Text>
      <Text style={styles.stepDescription}>
        Found {preview?.total_rows} rows with {preview?.columns.length} columns
      </Text>

      <Card variant="glass" style={styles.previewCard}>
        <Text style={styles.previewLabel}>Columns:</Text>
        <View style={styles.chipContainer}>
          {preview?.columns.map((col, idx) => (
            <View key={idx} style={styles.chip}>
              <Text style={styles.chipText}>{col}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.previewLabel}>Sample Data (first row):</Text>
        {preview?.sample_rows[0] && (
          <View style={styles.sampleData}>
            {Object.entries(preview.sample_rows[0]).slice(0, 5).map(([key, value], idx) => (
              <View key={idx} style={styles.sampleRow}>
                <Text style={styles.sampleKey}>{key}:</Text>
                <Text style={styles.sampleValue} numberOfLines={1}>
                  {value}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Card>

      <Button
        title="Continue to Mapping"
        onPress={handleContinueToMapping}
        fullWidth
        style={styles.button}
      />

      <TouchableOpacity onPress={() => setStep('upload')}>
        <Text style={styles.linkText}>Choose Different File</Text>
      </TouchableOpacity>
    </View>
  );

  const renderMappingStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Map Columns</Text>
      <Text style={styles.stepDescription}>
        Match your CSV columns to transaction fields
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Required Fields */}
        <Card variant="glass" style={styles.mappingCard}>
          <Text style={styles.mappingLabel}>Date Column *</Text>
          <View style={styles.pickerContainer}>
            {preview?.columns.map((col) => (
              <TouchableOpacity
                key={col}
                style={[styles.columnOption, mapping.date === col && styles.columnOptionSelected]}
                onPress={() => setMapping({ ...mapping, date: col })}
              >
                <Text style={[styles.columnOptionText, mapping.date === col && styles.columnOptionTextSelected]}>
                  {col}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card variant="glass" style={styles.mappingCard}>
          <Text style={styles.mappingLabel}>Description Column *</Text>
          <View style={styles.pickerContainer}>
            {preview?.columns.map((col) => (
              <TouchableOpacity
                key={col}
                style={[styles.columnOption, mapping.description === col && styles.columnOptionSelected]}
                onPress={() => setMapping({ ...mapping, description: col })}
              >
                <Text
                  style={[styles.columnOptionText, mapping.description === col && styles.columnOptionTextSelected]}
                >
                  {col}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card variant="glass" style={styles.mappingCard}>
          <Text style={styles.mappingLabel}>Amount Column *</Text>
          <View style={styles.pickerContainer}>
            {preview?.columns.map((col) => (
              <TouchableOpacity
                key={col}
                style={[styles.columnOption, mapping.amount === col && styles.columnOptionSelected]}
                onPress={() => setMapping({ ...mapping, amount: col })}
              >
                <Text style={[styles.columnOptionText, mapping.amount === col && styles.columnOptionTextSelected]}>
                  {col}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Optional Fields */}
        <Text style={styles.sectionTitle}>Optional Fields</Text>

        <Card variant="glass" style={styles.mappingCard}>
          <Text style={styles.mappingLabel}>Category Column</Text>
          <View style={styles.pickerContainer}>
            <TouchableOpacity
              style={[styles.columnOption, !mapping.category && styles.columnOptionSelected]}
              onPress={() => setMapping({ ...mapping, category: '' })}
            >
              <Text style={[styles.columnOptionText, !mapping.category && styles.columnOptionTextSelected]}>
                None
              </Text>
            </TouchableOpacity>
            {preview?.columns.map((col) => (
              <TouchableOpacity
                key={col}
                style={[styles.columnOption, mapping.category === col && styles.columnOptionSelected]}
                onPress={() => setMapping({ ...mapping, category: col })}
              >
                <Text style={[styles.columnOptionText, mapping.category === col && styles.columnOptionTextSelected]}>
                  {col}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Import Configuration */}
        <Text style={styles.sectionTitle}>Import Options</Text>

        <Card variant="glass" style={styles.mappingCard}>
          <Text style={styles.mappingLabel}>Date Format</Text>
          <View style={styles.pickerContainer}>
            {['%Y-%m-%d', '%m/%d/%Y', '%d/%m/%Y', '%Y/%m/%d'].map((format) => (
              <TouchableOpacity
                key={format}
                style={[styles.columnOption, config.date_format === format && styles.columnOptionSelected]}
                onPress={() => setConfig({ ...config, date_format: format })}
              >
                <Text style={[styles.columnOptionText, config.date_format === format && styles.columnOptionTextSelected]}>
                  {format}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <View style={{ height: spacing['2xl'] }} />
      </ScrollView>

      <View style={styles.buttonRow}>
        <Button
          title="Back"
          onPress={() => setStep('preview')}
          variant="outline"
          style={styles.buttonHalf}
        />
        <Button
          title={isLoading ? 'Importing...' : 'Import'}
          onPress={handleImport}
          loading={isLoading}
          disabled={isLoading}
          style={styles.buttonHalf}
        />
      </View>
    </View>
  );

  return (
    <LinearGradient colors={['#0f172a', '#1e293b', '#0f172a']} style={styles.gradient}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>CSV Import</Text>
        </View>

        {/* Step Indicator */}
        <View style={styles.stepIndicator}>
          <View style={[styles.stepDot, step !== 'upload' && styles.stepDotCompleted]}>
            <Text style={styles.stepDotText}>1</Text>
          </View>
          <View style={[styles.stepLine, (step === 'preview' || step === 'mapping') && styles.stepLineCompleted]} />
          <View style={[styles.stepDot, (step === 'mapping' || step === 'import') && styles.stepDotCompleted]}>
            <Text style={styles.stepDotText}>2</Text>
          </View>
          <View style={[styles.stepLine, step === 'import' && styles.stepLineCompleted]} />
          <View style={[styles.stepDot, step === 'import' && styles.stepDotCompleted]}>
            <Text style={styles.stepDotText}>3</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {step === 'upload' && renderUploadStep()}
          {step === 'preview' && renderPreviewStep()}
          {step === 'mapping' && renderMappingStep()}
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
  },
  backButton: {
    marginBottom: spacing.sm,
  },
  backButtonText: {
    color: colors.primary.green,
    ...typography.styles.body,
  },
  title: {
    color: colors.text.primary,
    ...typography.styles.h1,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.text.tertiary,
  },
  stepDotCompleted: {
    backgroundColor: colors.primary.green,
    borderColor: colors.primary.green,
  },
  stepDotText: {
    color: colors.text.primary,
    ...typography.styles.bodySmall,
    fontWeight: typography.weights.bold,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  stepLineCompleted: {
    backgroundColor: colors.primary.green,
  },
  scrollContent: {
    flexGrow: 1,
  },
  stepContainer: {
    flex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconLarge: {
    fontSize: 80,
  },
  stepTitle: {
    color: colors.text.primary,
    ...typography.styles.h2,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  stepDescription: {
    color: colors.text.secondary,
    ...typography.styles.body,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  button: {
    marginBottom: spacing.md,
  },
  infoCard: {
    padding: spacing.lg,
    marginVertical: spacing.lg,
  },
  infoTitle: {
    color: colors.text.primary,
    ...typography.styles.h3,
    marginBottom: spacing.sm,
  },
  infoText: {
    color: colors.text.secondary,
    ...typography.styles.body,
    marginBottom: spacing.xs,
  },
  linkText: {
    color: colors.primary.green,
    ...typography.styles.body,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  previewCard: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  previewLabel: {
    color: colors.text.primary,
    ...typography.styles.bodySmall,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.sm,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  chip: {
    backgroundColor: colors.primary.green + '20',
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  chipText: {
    color: colors.primary.green,
    fontSize: 12,
  },
  sampleData: {
    marginTop: spacing.sm,
  },
  sampleRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  sampleKey: {
    color: colors.text.tertiary,
    ...typography.styles.bodySmall,
    width: 100,
  },
  sampleValue: {
    color: colors.text.secondary,
    ...typography.styles.bodySmall,
    flex: 1,
  },
  sectionTitle: {
    color: colors.text.secondary,
    ...typography.styles.h3,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  mappingCard: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  mappingLabel: {
    color: colors.text.primary,
    ...typography.styles.body,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.sm,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  columnOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  columnOptionSelected: {
    backgroundColor: colors.primary.green,
    borderColor: colors.primary.green,
  },
  columnOptionText: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  columnOptionTextSelected: {
    color: '#000',
    fontWeight: typography.weights.semibold,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  buttonHalf: {
    flex: 1,
  },
});

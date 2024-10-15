import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, Settings, Play, Download, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';

interface DataStats {
  totalRecords: number;
  cleanedRecords: number;
  optimizationGain: number;
}

const Dashboard: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dataStats, setDataStats] = useState<DataStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setError(null);
    }
  };

  const cleanData = useCallback((data: any[]) => {
    // Simple data cleaning: Remove rows with missing values
    return data.filter(row => Object.values(row).every(value => value !== '' && value !== null && value !== undefined));
  }, []);

  const optimizeData = useCallback((data: any[]) => {
    // Simple optimization: Remove duplicate rows
    const uniqueData = data.filter((row, index, self) =>
      index === self.findIndex((t) => JSON.stringify(t) === JSON.stringify(row))
    );
    return uniqueData;
  }, []);

  const processData = useCallback(() => {
    setIsProcessing(true);
    setProgress(0);
    setError(null);

    if (!file) {
      setError('No file selected');
      setIsProcessing(false);
      return;
    }

    Papa.parse(file, {
      complete: (results) => {
        try {
          const originalData = results.data as any[];
          const cleanedData = cleanData(originalData);
          const optimizedData = optimizeData(cleanedData);

          const stats: DataStats = {
            totalRecords: originalData.length,
            cleanedRecords: optimizedData.length,
            optimizationGain: ((originalData.length - optimizedData.length) / originalData.length) * 100,
          };

          setDataStats(stats);
          setIsProcessing(false);
          setProgress(100);
        } catch (err) {
          setError('Error processing data');
          setIsProcessing(false);
        }
      },
      error: (error) => {
        setError(`Error parsing file: ${error.message}`);
        setIsProcessing(false);
      },
      step: (results, parser) => {
        setProgress(Math.round((results.meta.cursor / file.size) * 100));
      },
    });
  }, [file, cleanData, optimizeData]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Data Cleaning & Optimization</h1>
        
        <div className="mb-6">
          <label htmlFor="file-upload" className="block mb-2 text-sm font-medium text-gray-700">
            Upload Dataset
          </label>
          <div className="flex items-center justify-center w-full">
            <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">CSV (max. 100MB)</p>
              </div>
              <input id="file-upload" type="file" className="hidden" onChange={handleFileUpload} accept=".csv" />
            </label>
          </div>
          {file && <p className="mt-2 text-sm text-gray-500">Selected file: {file.name}</p>}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
            <AlertCircle className="mr-2" size={20} />
            {error}
          </div>
        )}

        <button
          onClick={processData}
          disabled={!file || isProcessing}
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isProcessing ? (
            <>
              <Settings className="animate-spin mr-2" />
              Processing... {progress}%
            </>
          ) : (
            <>
              <Play className="mr-2" />
              Start Processing
            </>
          )}
        </button>

        {dataStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-gray-50 rounded-md"
          >
            <h3 className="text-lg font-semibold mb-2">Processing Results</h3>
            <p>Total Records: {dataStats.totalRecords}</p>
            <p>Cleaned Records: {dataStats.cleanedRecords}</p>
            <p>Optimization Gain: {dataStats.optimizationGain.toFixed(2)}%</p>
            <button className="mt-4 w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition duration-300 flex items-center justify-center">
              <Download className="mr-2" />
              Download Processed Data
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
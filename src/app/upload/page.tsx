'use client';

import { useState } from 'react';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setExtractedText('');

    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      const data = await response.json();
      setExtractedText(data.text);
    } catch (error) {
      setError('An error occurred while uploading the file.');
      console.error(error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Upload PDF</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input type="file" accept="application/pdf" onChange={handleFileChange} className="mb-4" />
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Upload and Extract Text
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {extractedText && (
        <div className="mt-8 p-4 border rounded-md bg-gray-100 w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-4">Extracted Text</h2>
          <pre className="whitespace-pre-wrap">{extractedText}</pre>
        </div>
      )}
    </main>
  );
}

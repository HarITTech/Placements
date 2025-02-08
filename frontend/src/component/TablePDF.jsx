import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, PDFViewer } from '@react-pdf/renderer';
import Modal from 'react-modal';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 40,
    fontSize: 12,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    textAlign: 'center',
  },
  logo: {
    width: 100,
    height: 'auto',
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 8,
    color: '#34495e',
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    borderCollapse: 'collapse',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: '#34495e',
    color: '#ffffff',
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
    borderRight: '1px solid #000',
    width: '16.66%', // Fixed width for each header
  },
  tableCell: {
    padding: 10,
    textAlign: 'center',
    borderRight: '1px solid #000',
    borderBottom: '1px solid #000',
    width: '16.66%', // Fixed width for each cell
  },
  tableCellData: {
    padding: 10,
    textAlign: 'center',
    borderRight: '1px solid #000',
    borderBottom: '1px solid #000',
    backgroundColor: '#f8f9fa',
    width: '16.66%', // Fixed width for each cell
  },
  tableCellAlt: {
    padding: 10,
    textAlign: 'center',
    borderRight: '1px solid #000',
    borderBottom: '1px solid #000',
    backgroundColor: '#e9ecef',
    width: '16.66%', // Fixed width for each cell
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 10,
    color: '#34495e',
    borderTop: '1px solid #ccc',
    paddingTop: 10,
    marginTop: 20,
  },
  footerText: {
    marginBottom: 5,
  },
  footerHighlight: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
});

const DynamicTablePDF = ({ data, headers, logo, title, subtitle, onClose }) => {
  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image src={logo || "image"} style={styles.logo} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            {headers.map((header, index) => (
              <Text style={styles.tableHeader} key={index}>{header}</Text>
            ))}
          </View>
          {data.map((row, rowIndex) => (
            <View style={styles.tableRow} key={rowIndex}>
              {headers.map((header, colIndex) => (
                <Text style={rowIndex % 2 === 0 ? styles.tableCellData : styles.tableCellAlt} key={colIndex}>
                  {row[header] || ' '}
                </Text>
              ))}
            </View>
          ))}
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            <Text style={styles.footerHighlight}></Text> HarIT Tech Solution
          </Text>
          <Text style={styles.footerText}>
            <Text style={styles.footerHighlight }>Email Us:</Text> info@harittech.in
          </Text>
          <Text style={styles.footerText}>
            <Text style={styles.footerHighlight}></Text> www.harittech.in
          </Text>
          <Text style={styles.footerText}>
            <Text style={styles.footerHighlight}></Text> {new Date().toLocaleDateString()}
          </Text>
        </View>
      </Page>
    </Document>
  );

  return (
    <Modal 
      isOpen={true} 
      onRequestClose={onClose} 
      contentLabel="PDF Preview" 
      className="fixed inset-0 flex items-center justify-center z-100" 
      overlayClassName="fixed inset-0 bg rgba(0, 0, 0, 0.5) z-50" 
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/2">
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-xl font-bold">PDF Preview</h2>
          <button onClick={onClose} className="text-red-500 text-lg hover:text-red-700 p-1 rounded-md hover:bg-gray-100">
            &times;
          </button>
        </div>
        <div className="mt-4" style={{ height: '500px' }}>
          <PDFViewer style={{ width: '100%', height: '100%' }}>
            <MyDocument />
          </PDFViewer>
        </div>
        <button onClick={() => window.print()} className="mt-4 w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600">
          Download PDF
        </button>
      </div>
    </Modal>
  );
};

export default DynamicTablePDF;
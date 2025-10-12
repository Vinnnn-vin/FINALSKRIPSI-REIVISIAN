/* eslint-disable @typescript-eslint/no-explicit-any */
// src\app\frontend\dashboard\admin\utils\exportUtils.ts

/**
 * Mengonversi array objek menjadi string CSV dan memicu download.
 * File ini akan menggunakan titik koma (;) sebagai separator agar kompatibel dengan Excel regional Indonesia.
 * @param data Array objek yang akan diekspor.
 * @param filename Nama file yang akan diunduh (misal: 'users.csv').
 */
export const exportToCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) {
    console.error("No data to export.");
    return;
  }

  // Ambil header dari keys objek pertama
  const headers = Object.keys(data[0]);
  
  const headerRow = headers.join(';'); 
//   const headerRow = headers.join(','); // Mode Koma (Indonesia)

  // Konversi setiap objek menjadi baris CSV
  const csvRows = data.map(row => {
    return headers.map(fieldName => {
      // Ambil data sel, pastikan null/undefined menjadi string kosong
      let cell = row[fieldName] === null || row[fieldName] === undefined ? '' : String(row[fieldName]);
      
      // Ganti kutip dua di dalam data agar tidak merusak format CSV
      cell = cell.replace(/"/g, '""');

      // Jika data mengandung titik koma, kutip dua, atau baris baru, bungkus dengan kutip dua
      if (cell.search(/("|,|\n|;)/g) >= 0) {
        cell = `"${cell}"`;
      }
      return cell;
    }).join(';'); // [!] Diubah dari koma
  });

  // Gabungkan header dan semua baris
  const csvString = [headerRow, ...csvRows].join('\n');

  // [!] Tambahkan BOM (Byte Order Mark) untuk UTF-8 agar Excel mengenali karakter non-latin
  const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });

  // Buat link sementara untuk memicu download
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
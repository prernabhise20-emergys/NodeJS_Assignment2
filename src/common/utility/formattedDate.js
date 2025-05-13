const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    // const month =date.getMonth();
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
const convertToTimeFormat = decimalTime => {
  const timeNum = parseFloat(decimalTime);
  if (isNaN(timeNum)) return '00:00:00';

  const hours = Math.floor(timeNum);
  const minutes = Math.round((timeNum - hours) * 60);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
};
  export default {formatDate,convertToTimeFormat};
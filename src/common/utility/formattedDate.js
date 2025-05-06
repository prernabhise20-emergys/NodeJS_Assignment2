const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    // const month =date.getMonth();
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  export default formatDate;
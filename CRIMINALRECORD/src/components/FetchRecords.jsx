import axios from 'axios';

export const fetchCriminalRecords = async () => {
  const res = await axios.get('http://localhost:3001/api/records');
  return res.data;
};

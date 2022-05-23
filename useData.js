import { useState, useEffect } from 'react';
import { json } from 'd3';
const jsonUrl =
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

export const useData = () => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    json(jsonUrl)
      .then((data) => data.data)
      .then(setData);
  }, []);
  return data;
};

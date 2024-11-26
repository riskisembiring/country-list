import React, { useState, useEffect } from 'react';
import { Table, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import '../styles/ListCountry.css';

const ListCountry = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  const fetchData = async () => {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      const formattedData = result.map((item) => ({
        name: item.name.common,
        flags: item.flags.svg,
        code: item.cca3, // Menambahkan kode negara untuk digunakan di halaman detail
      }));
      setData(formattedData);
      setFilteredData(formattedData); // Inisialisasi data yang difilter
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleRowClick = (record) => {
    navigate('/detail', { state: { code: record.code } });
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchValue(value);
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
    console.log(filtered)
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Flags',
      dataIndex: 'flags',
      key: 'flags',
      render: (imageUrl, record) => (
        <img
          src={imageUrl}
          alt="-"
          style={{ width: 100, height: 80, objectFit: 'initial'}}
        />
      ),
    },
  ];

  return (
    <div className="table-container">
      <h1 style={{ textAlign: 'center' }}>List Country</h1>
      <Input
        placeholder="Search country by name"
        value={searchValue}
        onChange={handleSearch}
        style={{ marginBottom: 20, width: 300 }}
      />
      <Table 
        dataSource={filteredData} 
        columns={columns} 
        size="small"
        onRow={(record) => ({ onClick: () => handleRowClick(record), style: { cursor: 'pointer' } })}
      />
    </div>
  );
};

export default ListCountry;

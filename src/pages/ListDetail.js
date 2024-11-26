import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Table, Button, message as antdMessage  } from 'antd';
import CollabModal from './CollabModal';
import '../styles/ListDetail.css';

const ListDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location || {};
  const countryCode = state?.code; // Ambil kode negara dari state
  const [countryDetail, setCountryDetail] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [collabCountries, setCollabCountries] = useState([]);

  useEffect(() => {
    if (countryCode) {
      // Ambil data detail negara berdasarkan countryCode
      const fetchCountryDetail = async () => {
        try {
          const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const result = await response.json();
          setCountryDetail(result[0]); // Asumsi API mengembalikan array
        } catch (error) {
          console.error('Error fetching country detail:', error);
        }
      };
      fetchCountryDetail();
    }
      // Periksa apakah negara ini sudah pernah bekerja sama
      const savedCountries = JSON.parse(localStorage.getItem('collabCountries')) || [];
      setCollabCountries(savedCountries);
      if (savedCountries.some((country) => country.code === countryCode)) {
        setDisabledBtn(true);
      }
    }, [countryCode]);

  if (!countryDetail) {
    return <div>Loading...</div>;
  }

  const handleCooperation = () => {
    const success = Math.random() > 0.5;
    if (success) {
      // Simpan ke localStorage
      const savedCountries = JSON.parse(localStorage.getItem('collabCountries')) || [];
      const newCountry = { code: countryCode, name: countryDetail.name.common };
      if (!savedCountries.some((country) => country.code === countryCode)) {
        savedCountries.push(newCountry);
        localStorage.setItem('collabCountries', JSON.stringify(savedCountries));
      }
      setCollabCountries(savedCountries);
      console.log('tes', collabCountries)
      antdMessage.success(`Successfully established collaboration with ${countryDetail.name.common}`);
      setDisabledBtn(true);
    } else {
      antdMessage.error(`Failed to establish collaboration with ${countryDetail.name.common}`);
    }
  };

  const columns = [
    {
      title: 'Attribute',
      dataIndex: 'attribute',
      key: 'attribute',
    },
    {
      title: 'Details',
      dataIndex: 'detail',
      key: 'detail',
    },
  ];

  const data = [
    { key: '1', attribute: 'Country Name', detail: countryDetail.name.common },
    { key: '2', attribute: 'Maps', detail: <a href={countryDetail.maps.googleMaps} target="_blank" rel="noopener noreferrer">{countryDetail.maps.googleMaps}</a> },
    { key: '3', attribute: 'Languages', detail: countryDetail.languages ? Object.values(countryDetail.languages).join(', ') : '-' },
    { key: '4', attribute: 'Currencies', detail: countryDetail.currencies
        ? Object.entries(countryDetail.currencies)
            .map(([code, { name, symbol }]) => `${name} (${symbol})`)
            .join(', ')
        : 'No currencies available' },
    { key: '5', attribute: 'Independent', detail: countryDetail.independent ? 'Yes' : 'No' },
    { key: '6', attribute: 'Capital', detail: countryDetail.capital ? countryDetail.capital[0] : '-' },
    { key: '7', attribute: 'Flag', detail: <img src={countryDetail.flags.svg} alt="-" style={{ width: 50, height: 'auto' }} /> },
    { key: '8', attribute: 'Description', detail: countryDetail.flags.alt || '-' },
    { key: '9', attribute: 'Population', detail: countryDetail.population.toLocaleString('id-ID') },
    { key: '10', attribute: 'Region', detail: countryDetail.region },
    { key: '11', attribute: 'Subregion', detail: countryDetail.subregion || '-' },
    { key: '12', attribute: 'Area', detail: countryDetail.area.toLocaleString('id-ID') },
    { key: '13', attribute: 'Timezones', detail: countryDetail.timezones ? countryDetail.timezones[0] : '-' },
    { key: '14', attribute: 'Continents	', detail: countryDetail.continents ? countryDetail.continents[0] : '-' },
    { key: '15', attribute: 'Start Of Week', detail: countryDetail.startOfWeek },
    { key: '16', attribute: 'Capital Info', detail: countryDetail.capitalInfo.latlng.join(", ") },
    { key: '17', attribute: 'Coat Of Arms', detail: <img src={countryDetail.coatOfArms.svg} alt="-" style={{ width: 50, height: 'auto' }} /> },
    { key: '18', attribute: 'Cioc', detail: countryDetail.cioc || '-' },
    { key: '19', attribute: 'Status', detail: countryDetail.status || '-' },
  ];

  const handleCollabClick = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false); // Menyembunyikan modal ketika tombol batal diklik
  };

  const handleCancelCollab = (countryCode) => {
    const updatedCountries = collabCountries.filter(
      (country) => country.code !== countryCode
    );
    setCollabCountries(updatedCountries);
    localStorage.setItem('collabCountries', JSON.stringify(updatedCountries));
    antdMessage.info('Collaboration has been canceled.');
    if (updatedCountries.length === 0) {
      setDisabledBtn(false);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center' }}>{countryDetail.name.common} Details</h2>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
        size="middle"
        rowKey="key"
      />
      <div className='button-container'>
        <Button type="default" onClick={() => navigate('/', disabledBtn)}>Back</Button>
        <Button type="primary" onClick={handleCollabClick}>Show List Collab</Button>
        <Button type="primary" onClick={handleCooperation} disabled={disabledBtn}>Collab</Button>
      </div>

      {/* Panggil CollabModal dan kirim properti yang diperlukan */}
      <CollabModal
        isVisible={isModalVisible}
        onCancel={handleModalCancel}
        collabCountries={collabCountries}
        onCancelCollab={handleCancelCollab}
      />
    </div>
  );
};

export default ListDetail;

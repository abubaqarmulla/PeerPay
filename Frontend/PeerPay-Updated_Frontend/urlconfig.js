import * as Network from 'expo-network';
import { useState, useEffect } from 'react';

const getLocalIp = async () => {
  const ipAddress = await Network.getIpAddressAsync();
  console.log("Local IP Address:", ipAddress);
  return ipAddress;
};

export const BASE_URL = "personalwebsite-f53i.onrender.com";

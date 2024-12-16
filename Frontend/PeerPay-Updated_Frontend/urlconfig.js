import * as Network from 'expo-network';
import { useState, useEffect } from 'react';

const getLocalIp = async () => {
  const ipAddress = await Network.getIpAddressAsync();
  console.log("Local IP Address:", ipAddress);
  return ipAddress;
};

export const BASE_URL = "192.168.29.42:3000";

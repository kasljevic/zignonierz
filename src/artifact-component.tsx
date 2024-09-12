import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LabelList, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import romanianFlag from 'C:/Users/Antez/claude-artifact-runner/src/Flag-Romania.webp';

interface Character {
  Character: string;
  Level: number;
  "Class ID": number;
  Rank: number;
  Realm: string;
}

import data from './data.json';
const characters: Character[] = data as Character[];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];

const CLASS_NAMES: { [key: string]: string } = {
  "1": "Warrior", "2": "Paladin", "3": "Hunter", "4": "Rogue", "5": "Priest",
  "6": "Death Knight", "7": "Shaman", "8": "Mage", "9": "Warlock", "10": "Monk",
  "11": "Druid", "12": "Demon Hunter", "13": "Evoker"
};

const normalizeRealmName = (name: string): string => name.toLowerCase().replace(/[- ]/g, '');

const WoWCharacterDashboard: React.FC = () => {
  const [selectedRealm, setSelectedRealm] = useState<string>('all');

  const sortedData = useMemo(() => {
    return [...characters].sort((a, b) => a.Rank - b.Rank);
  }, []);

  const filteredData = useMemo(() => {
    return selectedRealm === 'all'
      ? sortedData
      : sortedData.filter(character => normalizeRealmName(character.Realm) === normalizeRealmName(selectedRealm));
  }, [selectedRealm, sortedData]);

  const realms = [...new Set(characters.map(character => character.Realm))];

  const classDistribution = filteredData.reduce((acc: { [key: string]: number }, character) => {
    const classId = character['Class ID'].toString();
    acc[classId] = (acc[classId] || 0) + 1;
    return acc;
  }, {});

  const classDistributionData = Object.entries(classDistribution).map(([classId, count]) => ({
    name: CLASS_NAMES[classId] || `Unknown (${classId})`,
    value: count
  }));

  // Summary statistics calculations
  const charactersPerRealm = characters.reduce((acc: { [key: string]: number }, char) => {
    acc[char.Realm] = (acc[char.Realm] || 0) + 1;
    return acc;
  }, {});

  const realmAverageLevels = characters.reduce((acc: { [key: string]: { sum: number; count: number } }, char) => {
    if (!acc[char.Realm]) {
      acc[char.Realm] = { sum: 0, count: 0 };
    }
    acc[char.Realm].sum += char.Level;
    acc[char.Realm].count += 1;
    return acc;
  }, {});

  const realmWithHighestAvgLevel = Object.entries(realmAverageLevels).reduce((highest, [realm, { sum, count }]) => {
    const avgLevel = sum / count;
    return avgLevel > highest.avgLevel ? { realm, avgLevel } : highest;
  }, { realm: '', avgLevel: 0 });

  // Convert charactersPerRealm object to array and sort by count
  const chartData = Object.entries(charactersPerRealm)
    .map(([realm, count]) => ({ realm, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      {/* Top header with Romanian flag and summary statistics */}
      <div className="flex items-center justify-between p-4 bg-gray-800">
        <div className="flex items-center">
          <img src={romanianFlag} alt="Romanian Flag" className="w-30 h-20 mr-4" />
          <h1 className="text-4xl font-bold">Zigoinerz in Canoinerz</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div>
            <p className="font-bold">Select realm</p>
          </div>
          <Select onValueChange={setSelectedRealm} defaultValue={selectedRealm}>
            <SelectTrigger className="w-[180px] bg-gray-700 text-gray-100">
              <SelectValue placeholder="Select Realm" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 text-gray-100">
              <SelectItem value="all">All Realms</SelectItem>
              {realms.map(realm => (
                <SelectItem key={realm} value={realm}>{realm}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left side: Table */}
        <div className="w-1/2 overflow-hidden">
          <Card className="h-full bg-gray-800 text-gray-100">
            <CardHeader>
              <CardTitle>Character List (Sorted by Rank)</CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100%-60px)] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="sticky top-0 bg-gray-700">Rank</TableHead>
                    <TableHead className="sticky top-0 bg-gray-700">Character</TableHead>
                    <TableHead className="sticky top-0 bg-gray-700">Level</TableHead>
                    <TableHead className="sticky top-0 bg-gray-700">Class</TableHead>
                    <TableHead className="sticky top-0 bg-gray-700">Realm</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((character, index) => (
                    <TableRow key={index} className="hover:bg-gray-700">
                      <TableCell className="py-2">{character.Rank}</TableCell>
                      <TableCell className="py-2">{character.Character}</TableCell>
                      <TableCell className="py-2">{character.Level}</TableCell>
                      <TableCell className="py-2">{CLASS_NAMES[character['Class ID'].toString()] || `Unknown (${character['Class ID']})`}</TableCell>
                      <TableCell className="py-2">{character.Realm}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right side: Charts */}
        <div className="w-1/2 overflow-y-auto p-4 space-y-4">
          <Card className="bg-gray-800 text-gray-100">
            <CardHeader>
              <CardTitle>Class Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={classDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {classDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              </CardContent>
              <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="realm" 
                    angle={-45} 
                    textAnchor="end" 
                    interval={0} 
                    tick={{ fontSize: 20, fill: '#fff' }} 
                  />
                  <YAxis tick={{ fill: '#fff' }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8">
                    <LabelList dataKey="count" position="top" fill="#fff" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WoWCharacterDashboard;
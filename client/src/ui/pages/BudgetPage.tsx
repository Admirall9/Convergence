import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  AccountBalance, 
  Search,
  FilterList
} from '@mui/icons-material';

interface BudgetItem {
  id: number;
  institution: string;
  category: string;
  program: string;
  amount: number;
  year: number;
  status: string;
}

const BudgetPage: React.FC = () => {
  const [budgetData, setBudgetData] = useState<BudgetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    // Simulate loading budget data from API
    setTimeout(() => {
      setBudgetData([
        {
          id: 1,
          institution: "Ministry of Interior",
          category: "Security",
          program: "National Security Program",
          amount: 15000000000,
          year: 2024,
          status: "Active"
        },
        {
          id: 2,
          institution: "Ministry of Justice",
          category: "Legal System",
          program: "Judicial Reform",
          amount: 8500000000,
          year: 2024,
          status: "Active"
        },
        {
          id: 3,
          institution: "Ministry of Economy and Finance",
          category: "Economic Development",
          program: "Infrastructure Development",
          amount: 25000000000,
          year: 2024,
          status: "Active"
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalBudget = budgetData.reduce((sum, item) => sum + item.amount, 0);

  const filteredData = budgetData.filter(item => {
    const matchesSearch = item.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.program.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = item.year === selectedYear;
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    
    return matchesSearch && matchesYear && matchesCategory;
  });

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, color: 'primary.main' }}>
        Budget Transparency
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AccountBalance color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="primary">
                  Total Budget
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {formatCurrency(totalBudget)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedYear} Fiscal Year
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUp color="success" sx={{ mr: 1 }} />
                <Typography variant="h6" color="success.main">
                  Active Programs
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {budgetData.filter(item => item.status === 'Active').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Currently funded
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingDown color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6" color="warning.main">
                  Institutions
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {new Set(budgetData.map(item => item.institution)).size}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                With budget allocations
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <FilterList color="info" sx={{ mr: 1 }} />
                <Typography variant="h6" color="info.main">
                  Categories
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {new Set(budgetData.map(item => item.category)).size}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Budget categories
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Search & Filter
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search institutions or programs"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Year</InputLabel>
              <Select
                value={selectedYear}
                label="Year"
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                <MenuItem value={2024}>2024</MenuItem>
                <MenuItem value={2023}>2023</MenuItem>
                <MenuItem value={2022}>2022</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                <MenuItem value="Security">Security</MenuItem>
                <MenuItem value="Legal System">Legal System</MenuItem>
                <MenuItem value="Economic Development">Economic Development</MenuItem>
                <MenuItem value="Education">Education</MenuItem>
                <MenuItem value="Healthcare">Healthcare</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button 
              variant="outlined" 
              fullWidth
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setSelectedYear(2024);
              }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Budget Table */}
      <Paper sx={{ boxShadow: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Institution</strong></TableCell>
                <TableCell><strong>Category</strong></TableCell>
                <TableCell><strong>Program</strong></TableCell>
                <TableCell align="right"><strong>Amount</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography>Loading budget data...</Typography>
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography color="text.secondary">
                      No budget data found matching your criteria
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {item.institution}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={item.category} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {item.program}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(item.amount)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={item.status} 
                        size="small" 
                        color={item.status === 'Active' ? 'success' : 'default'}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {filteredData.length > 0 && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Showing {filteredData.length} of {budgetData.length} budget items
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default BudgetPage;

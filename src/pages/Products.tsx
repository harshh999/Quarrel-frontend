import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { Filter, Search, Grid, List } from 'lucide-react';
import { Container, Button, Card } from '../styles/GlobalStyles';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

import { useApp } from '../contexts/AppContext';

const PageHeader = styled.div`
  padding: 120px 0 60px;
  background: linear-gradient(135deg, #FAFAFA, #F5F5F5);
`;

const PageTitle = styled.h1`
  font-size: 48px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 16px;
  color: #2C2C2C;
  
  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const PageSubtitle = styled.p`
  font-size: 18px;
  text-align: center;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
`;

const ProductsContainer = styled.div`
  padding: 60px 0 100px;
`;

const FiltersAndResults = styled.div`
  display: flex;
  gap: 40px;
  
  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 30px;
  }
`;

const Sidebar = styled.aside`
  flex: 0 0 280px;
  
  @media (max-width: 1024px) {
    flex: none;
  }
`;

const FilterCard = styled(Card)`
  margin-bottom: 24px;
`;

const FilterTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #2C2C2C;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FilterGroup = styled.div`
  margin-bottom: 24px;
`;

const FilterLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  cursor: pointer;
  transition: color 0.3s ease;
  
  &:hover {
    color: #D4AF37;
  }
`;

const FilterCheckbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #D4AF37;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #E0E0E0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  margin-bottom: 20px;
  
  &:focus {
    border-color: #D4AF37;
    outline: none;
  }
`;

const PriceRange = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 20px;
`;

const PriceInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 2px solid #E0E0E0;
  border-radius: 6px;
  font-size: 14px;
  
  &:focus {
    border-color: #D4AF37;
    outline: none;
  }
`;

const MainContent = styled.main`
  flex: 1;
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
`;

const ResultsInfo = styled.div`
  color: #666;
  font-size: 16px;
`;

const ViewControls = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const SortSelect = styled.select`
  padding: 8px 16px;
  border: 2px solid #E0E0E0;
  border-radius: 6px;
  font-size: 14px;
  background: #FFFFFF;
  cursor: pointer;
  
  &:focus {
    border-color: #D4AF37;
    outline: none;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  border: 2px solid #E0E0E0;
  border-radius: 6px;
  overflow: hidden;
`;

const ViewButton = styled.button<{ active: boolean }>`
  padding: 8px 12px;
  background: ${props => props.active ? '#D4AF37' : '#FFFFFF'};
  color: ${props => props.active ? '#FFFFFF' : '#666'};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? '#D4AF37' : '#F5F5F5'};
  }
`;

const ProductsGrid = styled.div<{ view: 'grid' | 'list' }>`
  display: grid;
  grid-template-columns: ${props => 
    props.view === 'grid' 
      ? 'repeat(auto-fill, minmax(280px, 1fr))' 
      : '1fr'
  };
  gap: ${props => props.view === 'grid' ? '32px' : '20px'};
`;

const NoResults = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: #666;
`;

const ClearFiltersButton = styled(Button)`
  width: 100%;
  margin-top: 20px;
`;

interface Filters {
  categories: string[];
  sizes: string[];
  colors: string[];
  priceRange: [number, number];
  searchQuery: string;
}

const Products: React.FC = () => {
  const { state } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    sizes: [],
    colors: [],
    priceRange: [0, 500],
    searchQuery: ''
  });

  // Initialize filters from URL params
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setFilters(prev => ({
        ...prev,
        categories: [category]
      }));
    }
  }, [searchParams]);

  // Get unique values for filters
  const availableCategories = [...new Set(products.map(p => p.category))];
  const availableSizes = [...new Set(products.flatMap(p => p.sizes))];
  const availableColors = [...new Set(products.flatMap(p => p.colors))];

  const filteredProducts = useMemo(() => {
  const filtered = products.filter(product => {
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false;
      }
      
      // Size filter
      if (filters.sizes.length > 0 && !filters.sizes.some(size => product.sizes.includes(size))) {
        return false;
      }
      
      // Color filter
      if (filters.colors.length > 0 && !filters.colors.some(color => product.colors.includes(color))) {
        return false;
      }
      
      // Price filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }
      
      // Search filter
      const searchQuery = filters.searchQuery || state.searchQuery;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.subcategory.toLowerCase().includes(query)
        );
      }
      
      return true;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Featured first, then by newest
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          if (a.newArrival && !b.newArrival) return -1;
          if (!a.newArrival && b.newArrival) return 1;
          return 0;
        });
    }

    return filtered;
  }, [filters, state.searchQuery, sortBy]);

  type FilterValue = string | number | [number, number];
  const handleFilterChange = (type: keyof Filters, value: FilterValue) => {
    setFilters(prev => {
      if (type === 'categories' || type === 'sizes' || type === 'colors') {
        const currentArray = prev[type] as string[];
        const newArray = currentArray.includes(value as string)
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value as string];
        return { ...prev, [type]: newArray };
      }
      if (type === 'priceRange' && Array.isArray(value)) {
        return { ...prev, priceRange: value as [number, number] };
      }
      return { ...prev, [type]: value };
    });
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      sizes: [],
      colors: [],
      priceRange: [0, 500],
      searchQuery: ''
    });
    setSearchParams({});
  };

  const hasActiveFilters = 
    filters.categories.length > 0 ||
    filters.sizes.length > 0 ||
    filters.colors.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 500 ||
    filters.searchQuery ||
    state.searchQuery;

  return (
    <>
      <PageHeader>
        <Container>
          <PageTitle>
            {filters.categories.length === 1 
              ? `${filters.categories[0].charAt(0).toUpperCase() + filters.categories[0].slice(1)}'s Collection`
              : 'All Products'
            }
          </PageTitle>
          <PageSubtitle>
            Discover our complete collection of premium men's and women's clothing
          </PageSubtitle>
        </Container>
      </PageHeader>

      <ProductsContainer>
        <Container>
          <FiltersAndResults>
            <Sidebar>
              <FilterCard>
                <FilterTitle>
                  <Search size={18} />
                  Search
                </FilterTitle>
                <SearchInput
                  type="text"
                  placeholder="Search products..."
                  value={filters.searchQuery}
                  onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                />
              </FilterCard>

              <FilterCard>
                <FilterTitle>
                  <Filter size={18} />
                  Filters
                </FilterTitle>
                
                <FilterGroup>
                  <h4 className="filter-label">Category</h4>
                  {availableCategories.map(category => (
                    <FilterLabel key={category}>
                      <FilterCheckbox
                        type="checkbox"
                        checked={filters.categories.includes(category)}
                        onChange={() => handleFilterChange('categories', category)}
                      />
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </FilterLabel>
                  ))}
                </FilterGroup>

                <FilterGroup>
                  <h4 className="filter-label">Size</h4>
                  {availableSizes.map(size => (
                    <FilterLabel key={size}>
                      <FilterCheckbox
                        type="checkbox"
                        checked={filters.sizes.includes(size)}
                        onChange={() => handleFilterChange('sizes', size)}
                      />
                      {size}
                    </FilterLabel>
                  ))}
                </FilterGroup>

                <FilterGroup>
                  <h4 className="filter-label">Color</h4>
                  {availableColors.map(color => (
                    <FilterLabel key={color}>
                      <FilterCheckbox
                        type="checkbox"
                        checked={filters.colors.includes(color)}
                        onChange={() => handleFilterChange('colors', color)}
                      />
                      {color}
                    </FilterLabel>
                  ))}
                </FilterGroup>

                <FilterGroup>
                  <h4 className="filter-label">Price Range</h4>
                  <PriceRange>
                    <PriceInput
                      type="number"
                      placeholder="Min"
                      value={filters.priceRange[0]}
                      onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value) || 0, filters.priceRange[1]])}
                    />
                    <span>-</span>
                    <PriceInput
                      type="number"
                      placeholder="Max"
                      value={filters.priceRange[1]}
                      onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value) || 500])}
                    />
                  </PriceRange>
                </FilterGroup>

                {hasActiveFilters && (
                  <ClearFiltersButton variant="outline" onClick={clearFilters}>
                    Clear All Filters
                  </ClearFiltersButton>
                )}
              </FilterCard>
            </Sidebar>

            <MainContent>
              <ResultsHeader>
                <ResultsInfo>
                  Showing {filteredProducts.length} of {products.length} products
                </ResultsInfo>
                
                <ViewControls>
                  <label htmlFor="sort-select" style={{display: 'none'}}>Sort products</label>
                  <SortSelect
                    id="sort-select"
                    aria-label="Sort products"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="featured">Featured</option>
                    <option value="name">Name A-Z</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </SortSelect>
                  
                  <ViewToggle>
                    <ViewButton
                      active={view === 'grid'}
                      onClick={() => setView('grid')}
                    >
                      <Grid size={16} />
                    </ViewButton>
                    <ViewButton
                      active={view === 'list'}
                      onClick={() => setView('list')}
                    >
                      <List size={16} />
                    </ViewButton>
                  </ViewToggle>
                </ViewControls>
              </ResultsHeader>

              {filteredProducts.length === 0 ? (
                <NoResults>
                  <h3 className="no-products">No products found</h3>
                  <p>Try adjusting your filters or search terms</p>
                </NoResults>
              ) : (
                <ProductsGrid view={view}>
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </ProductsGrid>
              )}
            </MainContent>
          </FiltersAndResults>
        </Container>
      </ProductsContainer>
    </>
  );
};

export default Products;
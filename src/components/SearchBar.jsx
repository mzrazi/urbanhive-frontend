import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Search } from 'lucide-react'

const SearchBar = ({ className }) => {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query)}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className={`flex w-full max-w-lg ${className}`}>
      <div className="relative flex-grow">
        <Input
          type="text"
          placeholder="Search for products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-10 w-full"
        />
      </div>
      <Button type="submit" className="ml-2">
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </form>
  )
}

export default SearchBar
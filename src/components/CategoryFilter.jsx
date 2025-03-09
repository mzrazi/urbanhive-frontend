import { useState } from 'react'
import { Check } from 'lucide-react'
import { Button } from './ui/button'

const CategoryFilter = ({ categories, selectedCategories, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleCategory = (categoryId) => {
    const newSelected = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId]
    
    onChange(newSelected)
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between"
      >
        Categories
        <span className="ml-1">
          {selectedCategories.length > 0 && `(${selectedCategories.length})`}
        </span>
      </Button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200">
          <div className="p-2 max-h-60 overflow-auto">
            {categories.map(category => (
              <div
                key={category.id}
                className="flex items-center px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer"
                onClick={() => toggleCategory(category.id)}
              >
                <div className="flex-shrink-0 h-4 w-4 border rounded mr-2 flex items-center justify-center">
                  {selectedCategories.includes(category.id) && (
                    <Check className="h-3 w-3 text-urbanhive-600" />
                  )}
                </div>
                <span>{category.name}</span>
              </div>
            ))}
          </div>
          <div className="border-t p-2 flex justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange([])}
            >
              Clear
            </Button>
            <Button
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryFilter
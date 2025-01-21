import * as React from "react"
import { Check, X, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "./badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./command"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

export type Tag = {
  id: string
  label: string
  category?: string
}

interface TagInputProps {
  tags: Tag[]
  selectedTags: Tag[]
  onTagSelect: (tag: Tag) => void
  onTagRemove: (tag: Tag) => void
  className?: string
  placeholder?: string
}

export function TagInput({
  tags,
  selectedTags,
  onTagSelect,
  onTagRemove,
  className,
  placeholder = "Ajouter des tags..."
}: TagInputProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const unselectedTags = tags.filter(
    tag => !selectedTags.find(selected => selected.id === tag.id)
  )

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap gap-2">
        {selectedTags.map(tag => (
          <Badge
            key={tag.id}
            variant="secondary"
            className="flex items-center gap-1 px-3 py-1.5"
          >
            {tag.label}
            <button
              type="button"
              className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onClick={() => onTagRemove(tag)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Retirer le tag {tag.label}</span>
            </button>
          </Badge>
        ))}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex h-8 items-center gap-2 rounded-md border border-input px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <Plus className="h-4 w-4" />
              Ajouter
            </button>
          </PopoverTrigger>
          <PopoverContent className="p-0" side="bottom" align="start">
            <Command>
              <CommandInput 
                placeholder={placeholder}
                value={search}
                onValueChange={setSearch}
              />
              <CommandList>
                <CommandEmpty>Aucun tag trouvé.</CommandEmpty>
                <CommandGroup heading="Tags suggérés">
                  {unselectedTags.map(tag => (
                    <CommandItem
                      key={tag.id}
                      value={tag.label}
                      onSelect={() => {
                        onTagSelect(tag)
                        setOpen(false)
                      }}
                    >
                      {tag.label}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedTags.find(selected => selected.id === tag.id)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

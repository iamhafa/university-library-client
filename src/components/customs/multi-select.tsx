import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";

// Generic interface cho các item có thể select
interface SelectableItem {
  // id?: number;
  [key: string]: any;
}

// Props cho standalone usage
interface MultiSelectStandaloneProps<T extends SelectableItem> {
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  items: T[];
  label: string;
  addButtonText: string;
  displayField?: keyof T;
  placeholder?: string;
  emptyOptionText?: string;
  selectedLabel?: string;
  minSelections?: number;
  maxSelections?: number;
  disabled?: boolean;
  className?: string;
  error?: string;
}

// Props cho react-hook-form usage
interface MultiSelectControllerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  T extends SelectableItem = SelectableItem
> {
  control: Control<TFieldValues>;
  name: TName;
  items: T[];
  label: string;
  addButtonText: string;
  displayField?: keyof T;
  placeholder?: string;
  emptyOptionText?: string;
  selectedLabel?: string;
  minSelections?: number;
  maxSelections?: number;
  disabled?: boolean;
  className?: string;
  rules?: object;
}

// Union type cho tất cả props
type MultiSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  T extends SelectableItem = SelectableItem
> = MultiSelectStandaloneProps<T> | MultiSelectControllerProps<TFieldValues, TName, T>;

// Type guard để kiểm tra có phải controller props không
function isControllerProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>, T extends SelectableItem>(
  props: MultiSelectProps<TFieldValues, TName, T>
): props is MultiSelectControllerProps<TFieldValues, TName, T> {
  return "control" in props && "name" in props;
}

// Core MultiSelect implementation
const MultiSelectCore = <T extends SelectableItem>({
  selectedIds = [],
  onChange,
  items = [],
  label,
  addButtonText,
  displayField = "name" as keyof T,
  placeholder = "Chọn...",
  emptyOptionText = "-- Không chọn --",
  selectedLabel = "Đã chọn:",
  minSelections = 1,
  maxSelections,
  disabled = false,
  error,
}: MultiSelectStandaloneProps<T>) => {
  const [selectBoxes, setSelectBoxes] = useState<number[]>([]);

  useEffect(() => {
    if (selectedIds.length > 0) {
      setSelectBoxes(selectedIds.map((_, index) => index));
    } else {
      setSelectBoxes([0]);
    }
  }, [selectedIds.length]);

  const addSelectBox = () => {
    if (maxSelections && selectBoxes.length >= maxSelections) return;
    const newId = Math.max(...selectBoxes, -1) + 1;
    setSelectBoxes([...selectBoxes, newId]);
  };

  const removeSelectBox = (boxId: number) => {
    if (selectBoxes.length <= minSelections) return;
    const boxIndex = selectBoxes.indexOf(boxId);
    const newSelectBoxes = selectBoxes.filter((id) => id !== boxId);
    const newSelectedIds = selectedIds.filter((_, index) => index !== boxIndex);
    setSelectBoxes(newSelectBoxes);
    onChange(newSelectedIds);
  };

  const updateSelection = (boxIndex: number, itemId: string) => {
    const newSelectedIds = [...selectedIds];
    const actualIndex = selectBoxes.indexOf(boxIndex);

    if (itemId === "EMPTY_OPTION") {
      newSelectedIds.splice(actualIndex, 1);
    } else {
      if (actualIndex < newSelectedIds.length) {
        newSelectedIds[actualIndex] = parseInt(itemId);
      } else {
        newSelectedIds.push(parseInt(itemId));
      }
    }
    onChange(newSelectedIds);
  };

  const getDisplayValue = (item: T): string => {
    return String(item[displayField] || item.name || `ID: ${item.id}`);
  };

  const getAvailableItems = (currentBoxIndex: number) => {
    const currentBoxPosition = selectBoxes.indexOf(currentBoxIndex);
    const currentValue = selectedIds[currentBoxPosition];
    return items.filter((item) => !selectedIds.includes(item.id) || item.id === currentValue);
  };

  const canAddMore = () => {
    if (disabled) return false;
    if (maxSelections && selectBoxes.length >= maxSelections) return false;
    return true;
  };

  const canRemove = () => {
    if (disabled) return false;
    return selectBoxes.length > minSelections;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className={`text-sm font-medium ${error ? "text-destructive" : ""}`}>{label}</label>
        {canAddMore() && (
          <Button type="button" variant="outline" size="sm" onClick={addSelectBox} className="h-8 px-2" disabled={disabled}>
            <Plus className="h-4 w-4 mr-1" />
            {addButtonText}
          </Button>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="space-y-2">
        {selectBoxes.map((boxId, index) => {
          const availableItems = getAvailableItems(boxId);
          const currentValue = selectedIds[index];

          return (
            <div key={boxId} className="flex items-center gap-2">
              <div className="flex-1">
                <Select
                  value={currentValue ? currentValue.toString() : "EMPTY_OPTION"}
                  onValueChange={(value) => updateSelection(boxId, value)}
                  disabled={disabled}
                >
                  <SelectTrigger className={error ? "border-destructive" : ""}>
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EMPTY_OPTION">{emptyOptionText}</SelectItem>
                    {availableItems.map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {getDisplayValue(item)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {canRemove() && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeSelectBox(boxId)}
                  className="h-10 w-10 p-0 text-destructive hover:text-destructive"
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {selectedIds.length > 0 && (
        <div className="mt-3 p-3 bg-muted rounded-md">
          <p className="text-sm font-medium mb-2">{selectedLabel}</p>
          <div className="flex flex-wrap gap-1">
            {selectedIds.map((itemId, index) => {
              const item = items.find((i) => i.id === itemId);
              return (
                <span
                  key={`${itemId}-${index}`}
                  className="inline-flex items-center px-2 py-1 bg-primary text-primary-foreground text-xs rounded-md"
                >
                  {item ? getDisplayValue(item) : `ID: ${itemId}`}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Main MultiSelect component with overloads
function MultiSelect<T extends SelectableItem>(props: MultiSelectStandaloneProps<T>): JSX.Element;

function MultiSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  T extends SelectableItem = SelectableItem
>(props: MultiSelectControllerProps<TFieldValues, TName, T>): JSX.Element;

function MultiSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  T extends SelectableItem = SelectableItem
>(props: MultiSelectProps<TFieldValues, TName, T>): JSX.Element {
  // Check if it's controller props
  if (isControllerProps(props)) {
    const {
      control,
      name,
      rules,
      items,
      label,
      addButtonText,
      displayField = "name" as keyof T,
      placeholder = "Chọn...",
      emptyOptionText = "-- Không chọn --",
      selectedLabel = "Đã chọn:",
      minSelections = 1,
      maxSelections,
      disabled = false,
    } = props;

    return (
      <div className="border p-4 rounded-lg">
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <MultiSelectCore<T>
              selectedIds={value || []}
              onChange={onChange}
              items={items}
              label={label}
              addButtonText={addButtonText}
              displayField={displayField}
              placeholder={placeholder}
              emptyOptionText={emptyOptionText}
              selectedLabel={selectedLabel}
              minSelections={minSelections}
              maxSelections={maxSelections}
              disabled={disabled}
              error={error?.message}
            />
          )}
        />
      </div>
    );
  }

  // Standalone usage
  return <MultiSelectCore<T> {...props} />;
}

export default MultiSelect;

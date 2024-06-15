import { useState } from "react";
import "./App.css";

const departments = Array.from({ length: 10 }, (_, i) => `Department ${i + 1}`);
const classes = Array.from({ length: 3 }, (_, i) => `Class ${i + 1}`);
const subclasses = Array.from({ length: 2 }, (_, i) => `Subclass ${i + 1}`);

function App() {
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedSubclasses, setSelectedSubclasses] = useState([]);
  const [selectedItemsTable, setSelectedItemsTable] = useState([]);

  const handleDepartmentChange = (dept) => {
    setSelectedDepartments((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    );
    setSelectedClasses([]); // Clear classes when department changes
    setSelectedSubclasses([]); // Clear subclasses too
  };

  const handleClassChange = (dept, cls) => {
    setSelectedClasses((prev) =>
      prev.some((c) => c.dept === dept && c.cls === cls)
        ? prev.filter((c) => !(c.dept === dept && c.cls === cls))
        : [...prev, { dept, cls }]
    );
    setSelectedSubclasses([]); // Clear subclasses when class changes
  };

  const handleSubclassChange = (dept, cls, subcls) => {
    setSelectedSubclasses((prev) =>
      prev.some((s) => s.dept === dept && s.cls === cls && s.subcls === subcls)
        ? prev.filter(
            (s) => !(s.dept === dept && s.cls === cls && s.subcls === subcls)
          )
        : [...prev, { dept, cls, subcls }]
    );
  };

  const isSelected = (type, item) => {
    switch (type) {
      case "dept":
        return selectedDepartments.includes(item);
      case "cls":
        return selectedClasses.some(
          (c) => c.dept === item.dept && c.cls === item.cls
        );
      case "subcls":
        return selectedSubclasses.some(
          (s) =>
            s.dept === item.dept &&
            s.cls === item.cls &&
            s.subcls === item.subcls
        );
      default:
        return false;
    }
  };

  const handleSaveSelections = () => {
    const newSelectedItems = []; // Create a new array to store the new selections

    selectedDepartments.forEach((dept) => {
      const deptIndex = departments.indexOf(dept) + 1;

      const selectedClassesForDept = selectedClasses.filter(
        (c) => c.dept === dept
      );

      if (selectedClassesForDept.length === 0) {
        newSelectedItems.push(`${deptIndex}`); // Only department selected
      } else {
        selectedClassesForDept.forEach((c) => {
          const clsIndex = classes.indexOf(c.cls) + 1;

          const selectedSubclassesForClass = selectedSubclasses.filter(
            (s) => s.dept === dept && s.cls === c.cls
          );

          if (selectedSubclassesForClass.length === 0) {
            newSelectedItems.push(`${deptIndex}_${clsIndex}`); // Only department and class selected
          } else {
            selectedSubclassesForClass.forEach((s) => {
              const subclsIndex = subclasses.indexOf(s.subcls) + 1;
              newSelectedItems.push(`${deptIndex}_${clsIndex}_${subclsIndex}`);
            });
          }
        });
      }
    });

    setSelectedItemsTable((prevSelectedItems) => [
      ...prevSelectedItems,
      ...newSelectedItems,
    ]); // Append new selections to the existing table
  };

  return (
    <div>
      <h2>Store</h2>
      <ul>
        {departments.map((dept) => (
          <li key={dept}>
            <input
              type="checkbox"
              checked={isSelected("dept", dept)}
              onChange={() => handleDepartmentChange(dept)}
            />
            {dept}
            {isSelected("dept", dept) && (
              <ul>
                {classes.map((cls) => (
                  <li key={cls}>
                    <input
                      type="checkbox"
                      checked={isSelected("cls", { dept, cls })}
                      onChange={() => handleClassChange(dept, cls)}
                    />
                    {cls}
                    {isSelected("cls", { dept, cls }) && (
                      <ul>
                        {subclasses.map((subcls) => (
                          <li key={subcls}>
                            <input
                              type="checkbox"
                              checked={isSelected("subcls", {
                                dept,
                                cls,
                                subcls,
                              })}
                              onChange={() =>
                                handleSubclassChange(dept, cls, subcls)
                              }
                            />
                            {subcls}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <button onClick={handleSaveSelections}>Save Selections</button>
      {/* Display the selected items in a table */}
      {selectedItemsTable.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Selected Items</th>
            </tr>
          </thead>
          <tbody>
            {selectedItemsTable.map((item, index) => (
              <tr key={index}>
                <td>{item}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;

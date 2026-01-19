import Select from 'react-select';
import { useTheme } from '../../context/ThemeContext';

const DropDown: React.FC = () => {
    const { colors } = useTheme();
    const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    ];

    return <Select options={options} />;
}

export default DropDown;
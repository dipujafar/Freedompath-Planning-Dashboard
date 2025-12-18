import PrivacyPolicyEditor from '@/components/(adminDashboard)/(setting)/privacyPolicy/PrivacyPolicyEditor';
import TermsConditionsEditor from '@/components/(adminDashboard)/(setting)/TermsConditions/TermsConditionsEditor';
import { Tabs } from 'antd';
const items = [
    {
        key: '1',
        label: 'Privacy Policy',
        children: <PrivacyPolicyEditor />,
    },
    {
        key: '2',
        label: 'Terms and Conditions',
        children: <TermsConditionsEditor />,
    }
];

const SettingsPage = () => {
    return (
        <Tabs defaultActiveKey="1" items={items} />
    );
};

export default SettingsPage;
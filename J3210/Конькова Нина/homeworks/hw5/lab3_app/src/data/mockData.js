export const experiments = [
    {
        id: '4f46e5',
        name: 'Image_Classifier_v1',
        accuracy: 0.92,
        status: 'Finished',
        date: '2026-03-10'
    },
    {
        id: '77d2a1',
        name: 'NLP_BERT_Base',
        accuracy: 0.85,
        status: 'Finished',
        date: '2026-03-12'
    },
    {
        id: '99b1c2',
        name: 'Object_Detection_YOLO',
        accuracy: 0.45,
        status: 'Running',
        date: '2026-03-13'
    },
    {
        id: '11a4b5',
        name: 'RNN_Time_Series',
        accuracy: 0.12,
        status: 'Failed',
        date: '2026-03-14'
    }
];

export const registeredModels = [
    {
        name: 'Customer_Churn_Pred',
        version: 'v1.2.0',
        stage: 'Production',
        artifactPath: 's3://models/churn/v1.2',
        modified: '2026-03-10',
        actions: ['Rollback', 'Deploy']
    },
    {
        name: 'Fraud_Detection_NN',
        version: 'v2.0.1',
        stage: 'Staging',
        artifactPath: 's3://models/fraud/v2.0',
        modified: '2026-03-12',
        actions: ['Archive', 'Promote']
    },
    {
        name: 'Image_Segmentator',
        version: 'v0.1.0',
        stage: 'Archived',
        artifactPath: 's3://models/seg/v0.1',
        modified: '2026-01-15',
        actions: ['Restore']
    }
];

export const artifacts = [
    { name: 'model_final.pth', type: 'binary', size: '240 MB' },
    { name: 'hyperparameters.yaml', type: 'code', size: '2 KB' },
    { name: 'confusion_matrix.png', type: 'image', size: '45 KB' },
    { name: 'validation_results.csv', type: 'spreadsheet', size: '18 KB' }
];

export default function QuickStats({projects}){
    if (!projects || projects.length ===0){
        return (
            <div className="quick-stats">
                <h3>Quick Stats</h3>
                <p>There are no projects available</p>
            </div>
        );
    }
    const totalProjects = projects.length;
    const totalCategories = projects.reduce((sum,p)=> sum + p.categories,0);
    const lastUpdated = projects.reduce((latest,p) =>
        new Date(p.lastUpdated) > new Date(latest) ? p.lastUpdated : latest,
    projects[0].lastUpdated);
    
    return (
        <div className="quick-stats">
            <h3>Quick Stats</h3>
            <p><strong>Total Projects:</strong>{totalProjects}</p>
            <p><strong>Total Categories:</strong>{totalCategories}</p>
            <p><strong>Last Updated:</strong>{lastUpdated}</p>
        </div>
    );
}
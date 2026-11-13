import { getCategories } from '../api/categories';
import { useQuery } from '@tanstack/react-query';


function CategoriesSection() {

    const { data, isPending, isError, error } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
    });

    if (isPending) {
        return <p>Chargement des catégories...</p>;
    }

    if (isError) {
        return <p>{error.message}</p>;
    }

    return (
        <section className="home-categories home-container">
            <h2>Explorer par catégorie</h2>

            <div className="home-categories-grid">
                {data.map((category) => (
                    <div
                        className="home-category-card"
                        key={category.id}
                    >
                        {/** 
                                <div className="home-category-icon">
                                    {category.icon}
                                </div>
                                */}
                        <h3>{category.name}</h3>
                    </div>
                ))}
            </div>
        </section>
    )

}

export default CategoriesSection;
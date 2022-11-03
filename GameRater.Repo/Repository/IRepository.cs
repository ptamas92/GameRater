using System.Linq.Expressions;

namespace GameRater.Repo.Repository
{
    public interface IRepository<TContext, TEntity> where TContext : class where TEntity : class
    {
        IEnumerable<TEntity> Get(Expression<Func<TEntity, bool>>? filter = null,
                                 Func<IQueryable<TEntity>,
                                 IOrderedQueryable<TEntity>>? orderBy = null,
                                 string includeProperties = "");

        IEnumerable<TEntity> GetAll();

        TEntity GetById(object id);

        void Insert(TEntity entity);

        void Update(TEntity entity);

        void Delete(TEntity entity);

        void Delete(object id);
    }
}

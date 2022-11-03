using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace GameRater.Repo.Repository
{
    public class Repository<TContext, TEntity> : IRepository<TContext, TEntity> where TContext : class where TEntity : class
    {
        private DbSet<TEntity> entities;
        private readonly ApplicationDbContext context;

        public Repository(TContext context)
        {
            if (typeof(TContext) == typeof(ApplicationDbContext))
            {
                this.context = context as ApplicationDbContext;
                entities = (context as ApplicationDbContext).Set<TEntity>();
            }
        }

        // Get
        public IEnumerable<TEntity> Get(Expression<Func<TEntity, bool>> filter = null, Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null, string includeProperties = "")
        {
            IQueryable<TEntity> query = entities;

            if (filter != null)
                query = query.Where(filter);

            foreach (var includeProperty in includeProperties.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                query = query.Include(includeProperty);

            return orderBy != null ? orderBy(query).ToList() : query.ToList();
        }

        // GetAll
        public IEnumerable<TEntity> GetAll()
        {
            return entities.AsEnumerable();
        }

        // GetById
        public TEntity GetById(object id)
        {
            return entities.Find(id);
        }

        // Insert
        public void Insert(TEntity entity)
        {
            if (entity == null)
                throw new ArgumentNullException("entity");

            entities.Add(entity);
            SaveChanges(entity, "Insert");
        }

        // Update
        public void Update(TEntity entity)
        {
            if (entity == null)
                throw new ArgumentNullException("entity");

            context.Entry(entity).State = EntityState.Modified;
            SaveChanges(entity, "Update");
        }

        // Delete (by id)
        public void Delete(object id)
        {
            var entity = entities.Find(id);

            if (entity != null)
                Delete(entity);
        }

        // Delete (by entity)
        public void Delete(TEntity entity)
        {
            if (entity == null)
                throw new ArgumentNullException("entity");

            entities.Remove(entity);
            SaveChanges(entity, "Delete");
        }


        //-----------------------------------------------------------------------------------------------------------------------------


        //SaveChanges
        private void SaveChanges(TEntity entity, string actionName)
        {
            var message = $"{actionName} - {entity.GetType().FullName}";

            try
            {
                var id = entity?.GetType().GetProperty("Id")?.GetValue(entity, null)?.ToString();

                if (!string.IsNullOrEmpty(id))
                    message += $" (Id: {id})";

                //Serilog.Log.Information(message);
            }
            catch (Exception ex)
            {
                //Serilog.Log.Error(ex, message);
            }

            try
            {
                context.SaveChanges();
            }
            catch (Exception ex)
            {
                //Serilog.Log.Error(ex, $"context.SaveChanges() - {message}");
            }
        }
    }
}


/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Plan
 * 
 */
export type Plan = $Result.DefaultSelection<Prisma.$PlanPayload>
/**
 * Model RequestLog
 * 
 */
export type RequestLog = $Result.DefaultSelection<Prisma.$RequestLogPayload>
/**
 * Model UserInvitation
 * 
 */
export type UserInvitation = $Result.DefaultSelection<Prisma.$UserInvitationPayload>
/**
 * Model DbCredentials
 * 
 */
export type DbCredentials = $Result.DefaultSelection<Prisma.$DbCredentialsPayload>
/**
 * Model Role
 * 
 */
export type Role = $Result.DefaultSelection<Prisma.$RolePayload>
/**
 * Model Permission
 * 
 */
export type Permission = $Result.DefaultSelection<Prisma.$PermissionPayload>
/**
 * Model RolePermission
 * 
 */
export type RolePermission = $Result.DefaultSelection<Prisma.$RolePermissionPayload>
/**
 * Model IntegrationRequest
 * 
 */
export type IntegrationRequest = $Result.DefaultSelection<Prisma.$IntegrationRequestPayload>
/**
 * Model Announcement
 * 
 */
export type Announcement = $Result.DefaultSelection<Prisma.$AnnouncementPayload>
/**
 * Model Newsletter
 * 
 */
export type Newsletter = $Result.DefaultSelection<Prisma.$NewsletterPayload>
/**
 * Model AnnouncementView
 * 
 */
export type AnnouncementView = $Result.DefaultSelection<Prisma.$AnnouncementViewPayload>
/**
 * Model StatusLog
 * 
 */
export type StatusLog = $Result.DefaultSelection<Prisma.$StatusLogPayload>
/**
 * Model SystemHeartbeat
 * 
 */
export type SystemHeartbeat = $Result.DefaultSelection<Prisma.$SystemHeartbeatPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const HostingType: {
  DATACENTER: 'DATACENTER',
  CLIENT_SERVER: 'CLIENT_SERVER'
};

export type HostingType = (typeof HostingType)[keyof typeof HostingType]


export const AnnouncementType: {
  DOC: 'DOC',
  INFO: 'INFO',
  WARNING: 'WARNING',
  ALERT: 'ALERT'
};

export type AnnouncementType = (typeof AnnouncementType)[keyof typeof AnnouncementType]

}

export type HostingType = $Enums.HostingType

export const HostingType: typeof $Enums.HostingType

export type AnnouncementType = $Enums.AnnouncementType

export const AnnouncementType: typeof $Enums.AnnouncementType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.plan`: Exposes CRUD operations for the **Plan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Plans
    * const plans = await prisma.plan.findMany()
    * ```
    */
  get plan(): Prisma.PlanDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.requestLog`: Exposes CRUD operations for the **RequestLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RequestLogs
    * const requestLogs = await prisma.requestLog.findMany()
    * ```
    */
  get requestLog(): Prisma.RequestLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userInvitation`: Exposes CRUD operations for the **UserInvitation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserInvitations
    * const userInvitations = await prisma.userInvitation.findMany()
    * ```
    */
  get userInvitation(): Prisma.UserInvitationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.dbCredentials`: Exposes CRUD operations for the **DbCredentials** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DbCredentials
    * const dbCredentials = await prisma.dbCredentials.findMany()
    * ```
    */
  get dbCredentials(): Prisma.DbCredentialsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.role`: Exposes CRUD operations for the **Role** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Roles
    * const roles = await prisma.role.findMany()
    * ```
    */
  get role(): Prisma.RoleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.permission`: Exposes CRUD operations for the **Permission** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Permissions
    * const permissions = await prisma.permission.findMany()
    * ```
    */
  get permission(): Prisma.PermissionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.rolePermission`: Exposes CRUD operations for the **RolePermission** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RolePermissions
    * const rolePermissions = await prisma.rolePermission.findMany()
    * ```
    */
  get rolePermission(): Prisma.RolePermissionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.integrationRequest`: Exposes CRUD operations for the **IntegrationRequest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more IntegrationRequests
    * const integrationRequests = await prisma.integrationRequest.findMany()
    * ```
    */
  get integrationRequest(): Prisma.IntegrationRequestDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.announcement`: Exposes CRUD operations for the **Announcement** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Announcements
    * const announcements = await prisma.announcement.findMany()
    * ```
    */
  get announcement(): Prisma.AnnouncementDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.newsletter`: Exposes CRUD operations for the **Newsletter** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Newsletters
    * const newsletters = await prisma.newsletter.findMany()
    * ```
    */
  get newsletter(): Prisma.NewsletterDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.announcementView`: Exposes CRUD operations for the **AnnouncementView** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AnnouncementViews
    * const announcementViews = await prisma.announcementView.findMany()
    * ```
    */
  get announcementView(): Prisma.AnnouncementViewDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.statusLog`: Exposes CRUD operations for the **StatusLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StatusLogs
    * const statusLogs = await prisma.statusLog.findMany()
    * ```
    */
  get statusLog(): Prisma.StatusLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.systemHeartbeat`: Exposes CRUD operations for the **SystemHeartbeat** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SystemHeartbeats
    * const systemHeartbeats = await prisma.systemHeartbeat.findMany()
    * ```
    */
  get systemHeartbeat(): Prisma.SystemHeartbeatDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.8.0
   * Query Engine version: 3c6e192761c0362d496ed980de936e2f3cebcd3a
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Plan: 'Plan',
    RequestLog: 'RequestLog',
    UserInvitation: 'UserInvitation',
    DbCredentials: 'DbCredentials',
    Role: 'Role',
    Permission: 'Permission',
    RolePermission: 'RolePermission',
    IntegrationRequest: 'IntegrationRequest',
    Announcement: 'Announcement',
    Newsletter: 'Newsletter',
    AnnouncementView: 'AnnouncementView',
    StatusLog: 'StatusLog',
    SystemHeartbeat: 'SystemHeartbeat'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "plan" | "requestLog" | "userInvitation" | "dbCredentials" | "role" | "permission" | "rolePermission" | "integrationRequest" | "announcement" | "newsletter" | "announcementView" | "statusLog" | "systemHeartbeat"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Plan: {
        payload: Prisma.$PlanPayload<ExtArgs>
        fields: Prisma.PlanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PlanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PlanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>
          }
          findFirst: {
            args: Prisma.PlanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PlanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>
          }
          findMany: {
            args: Prisma.PlanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>[]
          }
          create: {
            args: Prisma.PlanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>
          }
          createMany: {
            args: Prisma.PlanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PlanCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>[]
          }
          delete: {
            args: Prisma.PlanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>
          }
          update: {
            args: Prisma.PlanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>
          }
          deleteMany: {
            args: Prisma.PlanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PlanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PlanUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>[]
          }
          upsert: {
            args: Prisma.PlanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>
          }
          aggregate: {
            args: Prisma.PlanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePlan>
          }
          groupBy: {
            args: Prisma.PlanGroupByArgs<ExtArgs>
            result: $Utils.Optional<PlanGroupByOutputType>[]
          }
          count: {
            args: Prisma.PlanCountArgs<ExtArgs>
            result: $Utils.Optional<PlanCountAggregateOutputType> | number
          }
        }
      }
      RequestLog: {
        payload: Prisma.$RequestLogPayload<ExtArgs>
        fields: Prisma.RequestLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RequestLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequestLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RequestLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequestLogPayload>
          }
          findFirst: {
            args: Prisma.RequestLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequestLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RequestLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequestLogPayload>
          }
          findMany: {
            args: Prisma.RequestLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequestLogPayload>[]
          }
          create: {
            args: Prisma.RequestLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequestLogPayload>
          }
          createMany: {
            args: Prisma.RequestLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RequestLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequestLogPayload>[]
          }
          delete: {
            args: Prisma.RequestLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequestLogPayload>
          }
          update: {
            args: Prisma.RequestLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequestLogPayload>
          }
          deleteMany: {
            args: Prisma.RequestLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RequestLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RequestLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequestLogPayload>[]
          }
          upsert: {
            args: Prisma.RequestLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequestLogPayload>
          }
          aggregate: {
            args: Prisma.RequestLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRequestLog>
          }
          groupBy: {
            args: Prisma.RequestLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<RequestLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.RequestLogCountArgs<ExtArgs>
            result: $Utils.Optional<RequestLogCountAggregateOutputType> | number
          }
        }
      }
      UserInvitation: {
        payload: Prisma.$UserInvitationPayload<ExtArgs>
        fields: Prisma.UserInvitationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserInvitationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserInvitationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserInvitationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserInvitationPayload>
          }
          findFirst: {
            args: Prisma.UserInvitationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserInvitationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserInvitationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserInvitationPayload>
          }
          findMany: {
            args: Prisma.UserInvitationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserInvitationPayload>[]
          }
          create: {
            args: Prisma.UserInvitationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserInvitationPayload>
          }
          createMany: {
            args: Prisma.UserInvitationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserInvitationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserInvitationPayload>[]
          }
          delete: {
            args: Prisma.UserInvitationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserInvitationPayload>
          }
          update: {
            args: Prisma.UserInvitationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserInvitationPayload>
          }
          deleteMany: {
            args: Prisma.UserInvitationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserInvitationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserInvitationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserInvitationPayload>[]
          }
          upsert: {
            args: Prisma.UserInvitationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserInvitationPayload>
          }
          aggregate: {
            args: Prisma.UserInvitationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserInvitation>
          }
          groupBy: {
            args: Prisma.UserInvitationGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserInvitationGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserInvitationCountArgs<ExtArgs>
            result: $Utils.Optional<UserInvitationCountAggregateOutputType> | number
          }
        }
      }
      DbCredentials: {
        payload: Prisma.$DbCredentialsPayload<ExtArgs>
        fields: Prisma.DbCredentialsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DbCredentialsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DbCredentialsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DbCredentialsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DbCredentialsPayload>
          }
          findFirst: {
            args: Prisma.DbCredentialsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DbCredentialsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DbCredentialsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DbCredentialsPayload>
          }
          findMany: {
            args: Prisma.DbCredentialsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DbCredentialsPayload>[]
          }
          create: {
            args: Prisma.DbCredentialsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DbCredentialsPayload>
          }
          createMany: {
            args: Prisma.DbCredentialsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DbCredentialsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DbCredentialsPayload>[]
          }
          delete: {
            args: Prisma.DbCredentialsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DbCredentialsPayload>
          }
          update: {
            args: Prisma.DbCredentialsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DbCredentialsPayload>
          }
          deleteMany: {
            args: Prisma.DbCredentialsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DbCredentialsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DbCredentialsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DbCredentialsPayload>[]
          }
          upsert: {
            args: Prisma.DbCredentialsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DbCredentialsPayload>
          }
          aggregate: {
            args: Prisma.DbCredentialsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDbCredentials>
          }
          groupBy: {
            args: Prisma.DbCredentialsGroupByArgs<ExtArgs>
            result: $Utils.Optional<DbCredentialsGroupByOutputType>[]
          }
          count: {
            args: Prisma.DbCredentialsCountArgs<ExtArgs>
            result: $Utils.Optional<DbCredentialsCountAggregateOutputType> | number
          }
        }
      }
      Role: {
        payload: Prisma.$RolePayload<ExtArgs>
        fields: Prisma.RoleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RoleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RoleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          findFirst: {
            args: Prisma.RoleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RoleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          findMany: {
            args: Prisma.RoleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>[]
          }
          create: {
            args: Prisma.RoleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          createMany: {
            args: Prisma.RoleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RoleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>[]
          }
          delete: {
            args: Prisma.RoleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          update: {
            args: Prisma.RoleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          deleteMany: {
            args: Prisma.RoleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RoleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RoleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>[]
          }
          upsert: {
            args: Prisma.RoleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          aggregate: {
            args: Prisma.RoleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRole>
          }
          groupBy: {
            args: Prisma.RoleGroupByArgs<ExtArgs>
            result: $Utils.Optional<RoleGroupByOutputType>[]
          }
          count: {
            args: Prisma.RoleCountArgs<ExtArgs>
            result: $Utils.Optional<RoleCountAggregateOutputType> | number
          }
        }
      }
      Permission: {
        payload: Prisma.$PermissionPayload<ExtArgs>
        fields: Prisma.PermissionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PermissionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PermissionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>
          }
          findFirst: {
            args: Prisma.PermissionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PermissionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>
          }
          findMany: {
            args: Prisma.PermissionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>[]
          }
          create: {
            args: Prisma.PermissionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>
          }
          createMany: {
            args: Prisma.PermissionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PermissionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>[]
          }
          delete: {
            args: Prisma.PermissionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>
          }
          update: {
            args: Prisma.PermissionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>
          }
          deleteMany: {
            args: Prisma.PermissionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PermissionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PermissionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>[]
          }
          upsert: {
            args: Prisma.PermissionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>
          }
          aggregate: {
            args: Prisma.PermissionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePermission>
          }
          groupBy: {
            args: Prisma.PermissionGroupByArgs<ExtArgs>
            result: $Utils.Optional<PermissionGroupByOutputType>[]
          }
          count: {
            args: Prisma.PermissionCountArgs<ExtArgs>
            result: $Utils.Optional<PermissionCountAggregateOutputType> | number
          }
        }
      }
      RolePermission: {
        payload: Prisma.$RolePermissionPayload<ExtArgs>
        fields: Prisma.RolePermissionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RolePermissionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RolePermissionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload>
          }
          findFirst: {
            args: Prisma.RolePermissionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RolePermissionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload>
          }
          findMany: {
            args: Prisma.RolePermissionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload>[]
          }
          create: {
            args: Prisma.RolePermissionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload>
          }
          createMany: {
            args: Prisma.RolePermissionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RolePermissionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload>[]
          }
          delete: {
            args: Prisma.RolePermissionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload>
          }
          update: {
            args: Prisma.RolePermissionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload>
          }
          deleteMany: {
            args: Prisma.RolePermissionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RolePermissionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RolePermissionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload>[]
          }
          upsert: {
            args: Prisma.RolePermissionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload>
          }
          aggregate: {
            args: Prisma.RolePermissionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRolePermission>
          }
          groupBy: {
            args: Prisma.RolePermissionGroupByArgs<ExtArgs>
            result: $Utils.Optional<RolePermissionGroupByOutputType>[]
          }
          count: {
            args: Prisma.RolePermissionCountArgs<ExtArgs>
            result: $Utils.Optional<RolePermissionCountAggregateOutputType> | number
          }
        }
      }
      IntegrationRequest: {
        payload: Prisma.$IntegrationRequestPayload<ExtArgs>
        fields: Prisma.IntegrationRequestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.IntegrationRequestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationRequestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.IntegrationRequestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationRequestPayload>
          }
          findFirst: {
            args: Prisma.IntegrationRequestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationRequestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.IntegrationRequestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationRequestPayload>
          }
          findMany: {
            args: Prisma.IntegrationRequestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationRequestPayload>[]
          }
          create: {
            args: Prisma.IntegrationRequestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationRequestPayload>
          }
          createMany: {
            args: Prisma.IntegrationRequestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.IntegrationRequestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationRequestPayload>[]
          }
          delete: {
            args: Prisma.IntegrationRequestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationRequestPayload>
          }
          update: {
            args: Prisma.IntegrationRequestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationRequestPayload>
          }
          deleteMany: {
            args: Prisma.IntegrationRequestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.IntegrationRequestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.IntegrationRequestUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationRequestPayload>[]
          }
          upsert: {
            args: Prisma.IntegrationRequestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationRequestPayload>
          }
          aggregate: {
            args: Prisma.IntegrationRequestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateIntegrationRequest>
          }
          groupBy: {
            args: Prisma.IntegrationRequestGroupByArgs<ExtArgs>
            result: $Utils.Optional<IntegrationRequestGroupByOutputType>[]
          }
          count: {
            args: Prisma.IntegrationRequestCountArgs<ExtArgs>
            result: $Utils.Optional<IntegrationRequestCountAggregateOutputType> | number
          }
        }
      }
      Announcement: {
        payload: Prisma.$AnnouncementPayload<ExtArgs>
        fields: Prisma.AnnouncementFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AnnouncementFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnouncementPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AnnouncementFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnouncementPayload>
          }
          findFirst: {
            args: Prisma.AnnouncementFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnouncementPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AnnouncementFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnouncementPayload>
          }
          findMany: {
            args: Prisma.AnnouncementFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnouncementPayload>[]
          }
          create: {
            args: Prisma.AnnouncementCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnouncementPayload>
          }
          createMany: {
            args: Prisma.AnnouncementCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AnnouncementCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnouncementPayload>[]
          }
          delete: {
            args: Prisma.AnnouncementDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnouncementPayload>
          }
          update: {
            args: Prisma.AnnouncementUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnouncementPayload>
          }
          deleteMany: {
            args: Prisma.AnnouncementDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AnnouncementUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AnnouncementUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnouncementPayload>[]
          }
          upsert: {
            args: Prisma.AnnouncementUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnouncementPayload>
          }
          aggregate: {
            args: Prisma.AnnouncementAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAnnouncement>
          }
          groupBy: {
            args: Prisma.AnnouncementGroupByArgs<ExtArgs>
            result: $Utils.Optional<AnnouncementGroupByOutputType>[]
          }
          count: {
            args: Prisma.AnnouncementCountArgs<ExtArgs>
            result: $Utils.Optional<AnnouncementCountAggregateOutputType> | number
          }
        }
      }
      Newsletter: {
        payload: Prisma.$NewsletterPayload<ExtArgs>
        fields: Prisma.NewsletterFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NewsletterFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsletterPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NewsletterFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsletterPayload>
          }
          findFirst: {
            args: Prisma.NewsletterFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsletterPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NewsletterFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsletterPayload>
          }
          findMany: {
            args: Prisma.NewsletterFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsletterPayload>[]
          }
          create: {
            args: Prisma.NewsletterCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsletterPayload>
          }
          createMany: {
            args: Prisma.NewsletterCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NewsletterCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsletterPayload>[]
          }
          delete: {
            args: Prisma.NewsletterDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsletterPayload>
          }
          update: {
            args: Prisma.NewsletterUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsletterPayload>
          }
          deleteMany: {
            args: Prisma.NewsletterDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NewsletterUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.NewsletterUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsletterPayload>[]
          }
          upsert: {
            args: Prisma.NewsletterUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsletterPayload>
          }
          aggregate: {
            args: Prisma.NewsletterAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNewsletter>
          }
          groupBy: {
            args: Prisma.NewsletterGroupByArgs<ExtArgs>
            result: $Utils.Optional<NewsletterGroupByOutputType>[]
          }
          count: {
            args: Prisma.NewsletterCountArgs<ExtArgs>
            result: $Utils.Optional<NewsletterCountAggregateOutputType> | number
          }
        }
      }
      AnnouncementView: {
        payload: Prisma.$AnnouncementViewPayload<ExtArgs>
        fields: Prisma.AnnouncementViewFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AnnouncementViewFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnouncementViewPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AnnouncementViewFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnouncementViewPayload>
          }
          findFirst: {
            args: Prisma.AnnouncementViewFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnouncementViewPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AnnouncementViewFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnouncementViewPayload>
          }
          findMany: {
            args: Prisma.AnnouncementViewFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnouncementViewPayload>[]
          }
          create: {
            args: Prisma.AnnouncementViewCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnouncementViewPayload>
          }
          createMany: {
            args: Prisma.AnnouncementViewCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AnnouncementViewCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnouncementViewPayload>[]
          }
          delete: {
            args: Prisma.AnnouncementViewDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnouncementViewPayload>
          }
          update: {
            args: Prisma.AnnouncementViewUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnouncementViewPayload>
          }
          deleteMany: {
            args: Prisma.AnnouncementViewDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AnnouncementViewUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AnnouncementViewUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnouncementViewPayload>[]
          }
          upsert: {
            args: Prisma.AnnouncementViewUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnouncementViewPayload>
          }
          aggregate: {
            args: Prisma.AnnouncementViewAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAnnouncementView>
          }
          groupBy: {
            args: Prisma.AnnouncementViewGroupByArgs<ExtArgs>
            result: $Utils.Optional<AnnouncementViewGroupByOutputType>[]
          }
          count: {
            args: Prisma.AnnouncementViewCountArgs<ExtArgs>
            result: $Utils.Optional<AnnouncementViewCountAggregateOutputType> | number
          }
        }
      }
      StatusLog: {
        payload: Prisma.$StatusLogPayload<ExtArgs>
        fields: Prisma.StatusLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StatusLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatusLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StatusLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatusLogPayload>
          }
          findFirst: {
            args: Prisma.StatusLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatusLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StatusLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatusLogPayload>
          }
          findMany: {
            args: Prisma.StatusLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatusLogPayload>[]
          }
          create: {
            args: Prisma.StatusLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatusLogPayload>
          }
          createMany: {
            args: Prisma.StatusLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StatusLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatusLogPayload>[]
          }
          delete: {
            args: Prisma.StatusLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatusLogPayload>
          }
          update: {
            args: Prisma.StatusLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatusLogPayload>
          }
          deleteMany: {
            args: Prisma.StatusLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StatusLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StatusLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatusLogPayload>[]
          }
          upsert: {
            args: Prisma.StatusLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatusLogPayload>
          }
          aggregate: {
            args: Prisma.StatusLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStatusLog>
          }
          groupBy: {
            args: Prisma.StatusLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<StatusLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.StatusLogCountArgs<ExtArgs>
            result: $Utils.Optional<StatusLogCountAggregateOutputType> | number
          }
        }
      }
      SystemHeartbeat: {
        payload: Prisma.$SystemHeartbeatPayload<ExtArgs>
        fields: Prisma.SystemHeartbeatFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SystemHeartbeatFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemHeartbeatPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SystemHeartbeatFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemHeartbeatPayload>
          }
          findFirst: {
            args: Prisma.SystemHeartbeatFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemHeartbeatPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SystemHeartbeatFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemHeartbeatPayload>
          }
          findMany: {
            args: Prisma.SystemHeartbeatFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemHeartbeatPayload>[]
          }
          create: {
            args: Prisma.SystemHeartbeatCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemHeartbeatPayload>
          }
          createMany: {
            args: Prisma.SystemHeartbeatCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SystemHeartbeatCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemHeartbeatPayload>[]
          }
          delete: {
            args: Prisma.SystemHeartbeatDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemHeartbeatPayload>
          }
          update: {
            args: Prisma.SystemHeartbeatUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemHeartbeatPayload>
          }
          deleteMany: {
            args: Prisma.SystemHeartbeatDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SystemHeartbeatUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SystemHeartbeatUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemHeartbeatPayload>[]
          }
          upsert: {
            args: Prisma.SystemHeartbeatUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemHeartbeatPayload>
          }
          aggregate: {
            args: Prisma.SystemHeartbeatAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSystemHeartbeat>
          }
          groupBy: {
            args: Prisma.SystemHeartbeatGroupByArgs<ExtArgs>
            result: $Utils.Optional<SystemHeartbeatGroupByOutputType>[]
          }
          count: {
            args: Prisma.SystemHeartbeatCountArgs<ExtArgs>
            result: $Utils.Optional<SystemHeartbeatCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    plan?: PlanOmit
    requestLog?: RequestLogOmit
    userInvitation?: UserInvitationOmit
    dbCredentials?: DbCredentialsOmit
    role?: RoleOmit
    permission?: PermissionOmit
    rolePermission?: RolePermissionOmit
    integrationRequest?: IntegrationRequestOmit
    announcement?: AnnouncementOmit
    newsletter?: NewsletterOmit
    announcementView?: AnnouncementViewOmit
    statusLog?: StatusLogOmit
    systemHeartbeat?: SystemHeartbeatOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    requestLogs: number
    announcementViews: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    requestLogs?: boolean | UserCountOutputTypeCountRequestLogsArgs
    announcementViews?: boolean | UserCountOutputTypeCountAnnouncementViewsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountRequestLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RequestLogWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAnnouncementViewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnnouncementViewWhereInput
  }


  /**
   * Count Type PlanCountOutputType
   */

  export type PlanCountOutputType = {
    users: number
  }

  export type PlanCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | PlanCountOutputTypeCountUsersArgs
  }

  // Custom InputTypes
  /**
   * PlanCountOutputType without action
   */
  export type PlanCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanCountOutputType
     */
    select?: PlanCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PlanCountOutputType without action
   */
  export type PlanCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }


  /**
   * Count Type DbCredentialsCountOutputType
   */

  export type DbCredentialsCountOutputType = {
    users: number
  }

  export type DbCredentialsCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | DbCredentialsCountOutputTypeCountUsersArgs
  }

  // Custom InputTypes
  /**
   * DbCredentialsCountOutputType without action
   */
  export type DbCredentialsCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DbCredentialsCountOutputType
     */
    select?: DbCredentialsCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DbCredentialsCountOutputType without action
   */
  export type DbCredentialsCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }


  /**
   * Count Type RoleCountOutputType
   */

  export type RoleCountOutputType = {
    rolePermissions: number
    users: number
  }

  export type RoleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rolePermissions?: boolean | RoleCountOutputTypeCountRolePermissionsArgs
    users?: boolean | RoleCountOutputTypeCountUsersArgs
  }

  // Custom InputTypes
  /**
   * RoleCountOutputType without action
   */
  export type RoleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleCountOutputType
     */
    select?: RoleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RoleCountOutputType without action
   */
  export type RoleCountOutputTypeCountRolePermissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RolePermissionWhereInput
  }

  /**
   * RoleCountOutputType without action
   */
  export type RoleCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }


  /**
   * Count Type PermissionCountOutputType
   */

  export type PermissionCountOutputType = {
    rolePermissions: number
  }

  export type PermissionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rolePermissions?: boolean | PermissionCountOutputTypeCountRolePermissionsArgs
  }

  // Custom InputTypes
  /**
   * PermissionCountOutputType without action
   */
  export type PermissionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PermissionCountOutputType
     */
    select?: PermissionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PermissionCountOutputType without action
   */
  export type PermissionCountOutputTypeCountRolePermissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RolePermissionWhereInput
  }


  /**
   * Count Type AnnouncementCountOutputType
   */

  export type AnnouncementCountOutputType = {
    views: number
  }

  export type AnnouncementCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    views?: boolean | AnnouncementCountOutputTypeCountViewsArgs
  }

  // Custom InputTypes
  /**
   * AnnouncementCountOutputType without action
   */
  export type AnnouncementCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnnouncementCountOutputType
     */
    select?: AnnouncementCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AnnouncementCountOutputType without action
   */
  export type AnnouncementCountOutputTypeCountViewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnnouncementViewWhereInput
  }


  /**
   * Count Type NewsletterCountOutputType
   */

  export type NewsletterCountOutputType = {
    announcements: number
  }

  export type NewsletterCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    announcements?: boolean | NewsletterCountOutputTypeCountAnnouncementsArgs
  }

  // Custom InputTypes
  /**
   * NewsletterCountOutputType without action
   */
  export type NewsletterCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsletterCountOutputType
     */
    select?: NewsletterCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * NewsletterCountOutputType without action
   */
  export type NewsletterCountOutputTypeCountAnnouncementsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnnouncementWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    storeId: number | null
  }

  export type UserSumAggregateOutputType = {
    storeId: number | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    user: string | null
    passwordHash: string | null
    status: boolean | null
    dbCredentialsId: string | null
    email: string | null
    createdAt: Date | null
    updatedAt: Date | null
    storeId: number | null
    roleId: string | null
    planId: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    user: string | null
    passwordHash: string | null
    status: boolean | null
    dbCredentialsId: string | null
    email: string | null
    createdAt: Date | null
    updatedAt: Date | null
    storeId: number | null
    roleId: string | null
    planId: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    user: number
    passwordHash: number
    status: number
    dbCredentialsId: number
    email: number
    createdAt: number
    updatedAt: number
    storeId: number
    roleId: number
    planId: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    storeId?: true
  }

  export type UserSumAggregateInputType = {
    storeId?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    user?: true
    passwordHash?: true
    status?: true
    dbCredentialsId?: true
    email?: true
    createdAt?: true
    updatedAt?: true
    storeId?: true
    roleId?: true
    planId?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    user?: true
    passwordHash?: true
    status?: true
    dbCredentialsId?: true
    email?: true
    createdAt?: true
    updatedAt?: true
    storeId?: true
    roleId?: true
    planId?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    user?: true
    passwordHash?: true
    status?: true
    dbCredentialsId?: true
    email?: true
    createdAt?: true
    updatedAt?: true
    storeId?: true
    roleId?: true
    planId?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    user: string
    passwordHash: string
    status: boolean
    dbCredentialsId: string
    email: string | null
    createdAt: Date
    updatedAt: Date
    storeId: number
    roleId: string | null
    planId: string | null
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user?: boolean
    passwordHash?: boolean
    status?: boolean
    dbCredentialsId?: boolean
    email?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    storeId?: boolean
    roleId?: boolean
    planId?: boolean
    dbCredentials?: boolean | DbCredentialsDefaultArgs<ExtArgs>
    role?: boolean | User$roleArgs<ExtArgs>
    plan?: boolean | User$planArgs<ExtArgs>
    invitation?: boolean | User$invitationArgs<ExtArgs>
    requestLogs?: boolean | User$requestLogsArgs<ExtArgs>
    announcementViews?: boolean | User$announcementViewsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user?: boolean
    passwordHash?: boolean
    status?: boolean
    dbCredentialsId?: boolean
    email?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    storeId?: boolean
    roleId?: boolean
    planId?: boolean
    dbCredentials?: boolean | DbCredentialsDefaultArgs<ExtArgs>
    role?: boolean | User$roleArgs<ExtArgs>
    plan?: boolean | User$planArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user?: boolean
    passwordHash?: boolean
    status?: boolean
    dbCredentialsId?: boolean
    email?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    storeId?: boolean
    roleId?: boolean
    planId?: boolean
    dbCredentials?: boolean | DbCredentialsDefaultArgs<ExtArgs>
    role?: boolean | User$roleArgs<ExtArgs>
    plan?: boolean | User$planArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    user?: boolean
    passwordHash?: boolean
    status?: boolean
    dbCredentialsId?: boolean
    email?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    storeId?: boolean
    roleId?: boolean
    planId?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "user" | "passwordHash" | "status" | "dbCredentialsId" | "email" | "createdAt" | "updatedAt" | "storeId" | "roleId" | "planId", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dbCredentials?: boolean | DbCredentialsDefaultArgs<ExtArgs>
    role?: boolean | User$roleArgs<ExtArgs>
    plan?: boolean | User$planArgs<ExtArgs>
    invitation?: boolean | User$invitationArgs<ExtArgs>
    requestLogs?: boolean | User$requestLogsArgs<ExtArgs>
    announcementViews?: boolean | User$announcementViewsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dbCredentials?: boolean | DbCredentialsDefaultArgs<ExtArgs>
    role?: boolean | User$roleArgs<ExtArgs>
    plan?: boolean | User$planArgs<ExtArgs>
  }
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dbCredentials?: boolean | DbCredentialsDefaultArgs<ExtArgs>
    role?: boolean | User$roleArgs<ExtArgs>
    plan?: boolean | User$planArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      dbCredentials: Prisma.$DbCredentialsPayload<ExtArgs>
      role: Prisma.$RolePayload<ExtArgs> | null
      plan: Prisma.$PlanPayload<ExtArgs> | null
      invitation: Prisma.$UserInvitationPayload<ExtArgs> | null
      requestLogs: Prisma.$RequestLogPayload<ExtArgs>[]
      announcementViews: Prisma.$AnnouncementViewPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      user: string
      passwordHash: string
      status: boolean
      dbCredentialsId: string
      email: string | null
      createdAt: Date
      updatedAt: Date
      storeId: number
      roleId: string | null
      planId: string | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    dbCredentials<T extends DbCredentialsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DbCredentialsDefaultArgs<ExtArgs>>): Prisma__DbCredentialsClient<$Result.GetResult<Prisma.$DbCredentialsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    role<T extends User$roleArgs<ExtArgs> = {}>(args?: Subset<T, User$roleArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    plan<T extends User$planArgs<ExtArgs> = {}>(args?: Subset<T, User$planArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    invitation<T extends User$invitationArgs<ExtArgs> = {}>(args?: Subset<T, User$invitationArgs<ExtArgs>>): Prisma__UserInvitationClient<$Result.GetResult<Prisma.$UserInvitationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    requestLogs<T extends User$requestLogsArgs<ExtArgs> = {}>(args?: Subset<T, User$requestLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RequestLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    announcementViews<T extends User$announcementViewsArgs<ExtArgs> = {}>(args?: Subset<T, User$announcementViewsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnnouncementViewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly user: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly status: FieldRef<"User", 'Boolean'>
    readonly dbCredentialsId: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly storeId: FieldRef<"User", 'Int'>
    readonly roleId: FieldRef<"User", 'String'>
    readonly planId: FieldRef<"User", 'String'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.role
   */
  export type User$roleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    where?: RoleWhereInput
  }

  /**
   * User.plan
   */
  export type User$planArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Plan
     */
    omit?: PlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    where?: PlanWhereInput
  }

  /**
   * User.invitation
   */
  export type User$invitationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserInvitation
     */
    select?: UserInvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserInvitation
     */
    omit?: UserInvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInvitationInclude<ExtArgs> | null
    where?: UserInvitationWhereInput
  }

  /**
   * User.requestLogs
   */
  export type User$requestLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestLog
     */
    select?: RequestLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestLog
     */
    omit?: RequestLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestLogInclude<ExtArgs> | null
    where?: RequestLogWhereInput
    orderBy?: RequestLogOrderByWithRelationInput | RequestLogOrderByWithRelationInput[]
    cursor?: RequestLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RequestLogScalarFieldEnum | RequestLogScalarFieldEnum[]
  }

  /**
   * User.announcementViews
   */
  export type User$announcementViewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnnouncementView
     */
    select?: AnnouncementViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnnouncementView
     */
    omit?: AnnouncementViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnnouncementViewInclude<ExtArgs> | null
    where?: AnnouncementViewWhereInput
    orderBy?: AnnouncementViewOrderByWithRelationInput | AnnouncementViewOrderByWithRelationInput[]
    cursor?: AnnouncementViewWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AnnouncementViewScalarFieldEnum | AnnouncementViewScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Plan
   */

  export type AggregatePlan = {
    _count: PlanCountAggregateOutputType | null
    _avg: PlanAvgAggregateOutputType | null
    _sum: PlanSumAggregateOutputType | null
    _min: PlanMinAggregateOutputType | null
    _max: PlanMaxAggregateOutputType | null
  }

  export type PlanAvgAggregateOutputType = {
    reqMin: number | null
    reqMonth: number | null
    maxPageSize: number | null
    maxDateRangeDays: number | null
  }

  export type PlanSumAggregateOutputType = {
    reqMin: number | null
    reqMonth: number | null
    maxPageSize: number | null
    maxDateRangeDays: number | null
  }

  export type PlanMinAggregateOutputType = {
    id: string | null
    name: string | null
    reqMin: number | null
    reqMonth: number | null
    maxPageSize: number | null
    maxDateRangeDays: number | null
  }

  export type PlanMaxAggregateOutputType = {
    id: string | null
    name: string | null
    reqMin: number | null
    reqMonth: number | null
    maxPageSize: number | null
    maxDateRangeDays: number | null
  }

  export type PlanCountAggregateOutputType = {
    id: number
    name: number
    reqMin: number
    reqMonth: number
    maxPageSize: number
    maxDateRangeDays: number
    _all: number
  }


  export type PlanAvgAggregateInputType = {
    reqMin?: true
    reqMonth?: true
    maxPageSize?: true
    maxDateRangeDays?: true
  }

  export type PlanSumAggregateInputType = {
    reqMin?: true
    reqMonth?: true
    maxPageSize?: true
    maxDateRangeDays?: true
  }

  export type PlanMinAggregateInputType = {
    id?: true
    name?: true
    reqMin?: true
    reqMonth?: true
    maxPageSize?: true
    maxDateRangeDays?: true
  }

  export type PlanMaxAggregateInputType = {
    id?: true
    name?: true
    reqMin?: true
    reqMonth?: true
    maxPageSize?: true
    maxDateRangeDays?: true
  }

  export type PlanCountAggregateInputType = {
    id?: true
    name?: true
    reqMin?: true
    reqMonth?: true
    maxPageSize?: true
    maxDateRangeDays?: true
    _all?: true
  }

  export type PlanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Plan to aggregate.
     */
    where?: PlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Plans to fetch.
     */
    orderBy?: PlanOrderByWithRelationInput | PlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Plans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Plans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Plans
    **/
    _count?: true | PlanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PlanAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PlanSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PlanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PlanMaxAggregateInputType
  }

  export type GetPlanAggregateType<T extends PlanAggregateArgs> = {
        [P in keyof T & keyof AggregatePlan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePlan[P]>
      : GetScalarType<T[P], AggregatePlan[P]>
  }




  export type PlanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlanWhereInput
    orderBy?: PlanOrderByWithAggregationInput | PlanOrderByWithAggregationInput[]
    by: PlanScalarFieldEnum[] | PlanScalarFieldEnum
    having?: PlanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PlanCountAggregateInputType | true
    _avg?: PlanAvgAggregateInputType
    _sum?: PlanSumAggregateInputType
    _min?: PlanMinAggregateInputType
    _max?: PlanMaxAggregateInputType
  }

  export type PlanGroupByOutputType = {
    id: string
    name: string
    reqMin: number
    reqMonth: number
    maxPageSize: number
    maxDateRangeDays: number
    _count: PlanCountAggregateOutputType | null
    _avg: PlanAvgAggregateOutputType | null
    _sum: PlanSumAggregateOutputType | null
    _min: PlanMinAggregateOutputType | null
    _max: PlanMaxAggregateOutputType | null
  }

  type GetPlanGroupByPayload<T extends PlanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PlanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PlanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PlanGroupByOutputType[P]>
            : GetScalarType<T[P], PlanGroupByOutputType[P]>
        }
      >
    >


  export type PlanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    reqMin?: boolean
    reqMonth?: boolean
    maxPageSize?: boolean
    maxDateRangeDays?: boolean
    users?: boolean | Plan$usersArgs<ExtArgs>
    _count?: boolean | PlanCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["plan"]>

  export type PlanSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    reqMin?: boolean
    reqMonth?: boolean
    maxPageSize?: boolean
    maxDateRangeDays?: boolean
  }, ExtArgs["result"]["plan"]>

  export type PlanSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    reqMin?: boolean
    reqMonth?: boolean
    maxPageSize?: boolean
    maxDateRangeDays?: boolean
  }, ExtArgs["result"]["plan"]>

  export type PlanSelectScalar = {
    id?: boolean
    name?: boolean
    reqMin?: boolean
    reqMonth?: boolean
    maxPageSize?: boolean
    maxDateRangeDays?: boolean
  }

  export type PlanOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "reqMin" | "reqMonth" | "maxPageSize" | "maxDateRangeDays", ExtArgs["result"]["plan"]>
  export type PlanInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | Plan$usersArgs<ExtArgs>
    _count?: boolean | PlanCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PlanIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type PlanIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PlanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Plan"
    objects: {
      users: Prisma.$UserPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      reqMin: number
      reqMonth: number
      maxPageSize: number
      maxDateRangeDays: number
    }, ExtArgs["result"]["plan"]>
    composites: {}
  }

  type PlanGetPayload<S extends boolean | null | undefined | PlanDefaultArgs> = $Result.GetResult<Prisma.$PlanPayload, S>

  type PlanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PlanFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PlanCountAggregateInputType | true
    }

  export interface PlanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Plan'], meta: { name: 'Plan' } }
    /**
     * Find zero or one Plan that matches the filter.
     * @param {PlanFindUniqueArgs} args - Arguments to find a Plan
     * @example
     * // Get one Plan
     * const plan = await prisma.plan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PlanFindUniqueArgs>(args: SelectSubset<T, PlanFindUniqueArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Plan that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PlanFindUniqueOrThrowArgs} args - Arguments to find a Plan
     * @example
     * // Get one Plan
     * const plan = await prisma.plan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PlanFindUniqueOrThrowArgs>(args: SelectSubset<T, PlanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Plan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanFindFirstArgs} args - Arguments to find a Plan
     * @example
     * // Get one Plan
     * const plan = await prisma.plan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PlanFindFirstArgs>(args?: SelectSubset<T, PlanFindFirstArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Plan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanFindFirstOrThrowArgs} args - Arguments to find a Plan
     * @example
     * // Get one Plan
     * const plan = await prisma.plan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PlanFindFirstOrThrowArgs>(args?: SelectSubset<T, PlanFindFirstOrThrowArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Plans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Plans
     * const plans = await prisma.plan.findMany()
     * 
     * // Get first 10 Plans
     * const plans = await prisma.plan.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const planWithIdOnly = await prisma.plan.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PlanFindManyArgs>(args?: SelectSubset<T, PlanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Plan.
     * @param {PlanCreateArgs} args - Arguments to create a Plan.
     * @example
     * // Create one Plan
     * const Plan = await prisma.plan.create({
     *   data: {
     *     // ... data to create a Plan
     *   }
     * })
     * 
     */
    create<T extends PlanCreateArgs>(args: SelectSubset<T, PlanCreateArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Plans.
     * @param {PlanCreateManyArgs} args - Arguments to create many Plans.
     * @example
     * // Create many Plans
     * const plan = await prisma.plan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PlanCreateManyArgs>(args?: SelectSubset<T, PlanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Plans and returns the data saved in the database.
     * @param {PlanCreateManyAndReturnArgs} args - Arguments to create many Plans.
     * @example
     * // Create many Plans
     * const plan = await prisma.plan.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Plans and only return the `id`
     * const planWithIdOnly = await prisma.plan.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PlanCreateManyAndReturnArgs>(args?: SelectSubset<T, PlanCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Plan.
     * @param {PlanDeleteArgs} args - Arguments to delete one Plan.
     * @example
     * // Delete one Plan
     * const Plan = await prisma.plan.delete({
     *   where: {
     *     // ... filter to delete one Plan
     *   }
     * })
     * 
     */
    delete<T extends PlanDeleteArgs>(args: SelectSubset<T, PlanDeleteArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Plan.
     * @param {PlanUpdateArgs} args - Arguments to update one Plan.
     * @example
     * // Update one Plan
     * const plan = await prisma.plan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PlanUpdateArgs>(args: SelectSubset<T, PlanUpdateArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Plans.
     * @param {PlanDeleteManyArgs} args - Arguments to filter Plans to delete.
     * @example
     * // Delete a few Plans
     * const { count } = await prisma.plan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PlanDeleteManyArgs>(args?: SelectSubset<T, PlanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Plans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Plans
     * const plan = await prisma.plan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PlanUpdateManyArgs>(args: SelectSubset<T, PlanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Plans and returns the data updated in the database.
     * @param {PlanUpdateManyAndReturnArgs} args - Arguments to update many Plans.
     * @example
     * // Update many Plans
     * const plan = await prisma.plan.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Plans and only return the `id`
     * const planWithIdOnly = await prisma.plan.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PlanUpdateManyAndReturnArgs>(args: SelectSubset<T, PlanUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Plan.
     * @param {PlanUpsertArgs} args - Arguments to update or create a Plan.
     * @example
     * // Update or create a Plan
     * const plan = await prisma.plan.upsert({
     *   create: {
     *     // ... data to create a Plan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Plan we want to update
     *   }
     * })
     */
    upsert<T extends PlanUpsertArgs>(args: SelectSubset<T, PlanUpsertArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Plans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanCountArgs} args - Arguments to filter Plans to count.
     * @example
     * // Count the number of Plans
     * const count = await prisma.plan.count({
     *   where: {
     *     // ... the filter for the Plans we want to count
     *   }
     * })
    **/
    count<T extends PlanCountArgs>(
      args?: Subset<T, PlanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PlanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Plan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PlanAggregateArgs>(args: Subset<T, PlanAggregateArgs>): Prisma.PrismaPromise<GetPlanAggregateType<T>>

    /**
     * Group by Plan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PlanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PlanGroupByArgs['orderBy'] }
        : { orderBy?: PlanGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PlanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Plan model
   */
  readonly fields: PlanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Plan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PlanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends Plan$usersArgs<ExtArgs> = {}>(args?: Subset<T, Plan$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Plan model
   */
  interface PlanFieldRefs {
    readonly id: FieldRef<"Plan", 'String'>
    readonly name: FieldRef<"Plan", 'String'>
    readonly reqMin: FieldRef<"Plan", 'Int'>
    readonly reqMonth: FieldRef<"Plan", 'Int'>
    readonly maxPageSize: FieldRef<"Plan", 'Int'>
    readonly maxDateRangeDays: FieldRef<"Plan", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Plan findUnique
   */
  export type PlanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Plan
     */
    omit?: PlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * Filter, which Plan to fetch.
     */
    where: PlanWhereUniqueInput
  }

  /**
   * Plan findUniqueOrThrow
   */
  export type PlanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Plan
     */
    omit?: PlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * Filter, which Plan to fetch.
     */
    where: PlanWhereUniqueInput
  }

  /**
   * Plan findFirst
   */
  export type PlanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Plan
     */
    omit?: PlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * Filter, which Plan to fetch.
     */
    where?: PlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Plans to fetch.
     */
    orderBy?: PlanOrderByWithRelationInput | PlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Plans.
     */
    cursor?: PlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Plans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Plans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Plans.
     */
    distinct?: PlanScalarFieldEnum | PlanScalarFieldEnum[]
  }

  /**
   * Plan findFirstOrThrow
   */
  export type PlanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Plan
     */
    omit?: PlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * Filter, which Plan to fetch.
     */
    where?: PlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Plans to fetch.
     */
    orderBy?: PlanOrderByWithRelationInput | PlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Plans.
     */
    cursor?: PlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Plans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Plans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Plans.
     */
    distinct?: PlanScalarFieldEnum | PlanScalarFieldEnum[]
  }

  /**
   * Plan findMany
   */
  export type PlanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Plan
     */
    omit?: PlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * Filter, which Plans to fetch.
     */
    where?: PlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Plans to fetch.
     */
    orderBy?: PlanOrderByWithRelationInput | PlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Plans.
     */
    cursor?: PlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Plans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Plans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Plans.
     */
    distinct?: PlanScalarFieldEnum | PlanScalarFieldEnum[]
  }

  /**
   * Plan create
   */
  export type PlanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Plan
     */
    omit?: PlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * The data needed to create a Plan.
     */
    data: XOR<PlanCreateInput, PlanUncheckedCreateInput>
  }

  /**
   * Plan createMany
   */
  export type PlanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Plans.
     */
    data: PlanCreateManyInput | PlanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Plan createManyAndReturn
   */
  export type PlanCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Plan
     */
    omit?: PlanOmit<ExtArgs> | null
    /**
     * The data used to create many Plans.
     */
    data: PlanCreateManyInput | PlanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Plan update
   */
  export type PlanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Plan
     */
    omit?: PlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * The data needed to update a Plan.
     */
    data: XOR<PlanUpdateInput, PlanUncheckedUpdateInput>
    /**
     * Choose, which Plan to update.
     */
    where: PlanWhereUniqueInput
  }

  /**
   * Plan updateMany
   */
  export type PlanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Plans.
     */
    data: XOR<PlanUpdateManyMutationInput, PlanUncheckedUpdateManyInput>
    /**
     * Filter which Plans to update
     */
    where?: PlanWhereInput
    /**
     * Limit how many Plans to update.
     */
    limit?: number
  }

  /**
   * Plan updateManyAndReturn
   */
  export type PlanUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Plan
     */
    omit?: PlanOmit<ExtArgs> | null
    /**
     * The data used to update Plans.
     */
    data: XOR<PlanUpdateManyMutationInput, PlanUncheckedUpdateManyInput>
    /**
     * Filter which Plans to update
     */
    where?: PlanWhereInput
    /**
     * Limit how many Plans to update.
     */
    limit?: number
  }

  /**
   * Plan upsert
   */
  export type PlanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Plan
     */
    omit?: PlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * The filter to search for the Plan to update in case it exists.
     */
    where: PlanWhereUniqueInput
    /**
     * In case the Plan found by the `where` argument doesn't exist, create a new Plan with this data.
     */
    create: XOR<PlanCreateInput, PlanUncheckedCreateInput>
    /**
     * In case the Plan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PlanUpdateInput, PlanUncheckedUpdateInput>
  }

  /**
   * Plan delete
   */
  export type PlanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Plan
     */
    omit?: PlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * Filter which Plan to delete.
     */
    where: PlanWhereUniqueInput
  }

  /**
   * Plan deleteMany
   */
  export type PlanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Plans to delete
     */
    where?: PlanWhereInput
    /**
     * Limit how many Plans to delete.
     */
    limit?: number
  }

  /**
   * Plan.users
   */
  export type Plan$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Plan without action
   */
  export type PlanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Plan
     */
    omit?: PlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
  }


  /**
   * Model RequestLog
   */

  export type AggregateRequestLog = {
    _count: RequestLogCountAggregateOutputType | null
    _avg: RequestLogAvgAggregateOutputType | null
    _sum: RequestLogSumAggregateOutputType | null
    _min: RequestLogMinAggregateOutputType | null
    _max: RequestLogMaxAggregateOutputType | null
  }

  export type RequestLogAvgAggregateOutputType = {
    status: number | null
    durationMs: number | null
  }

  export type RequestLogSumAggregateOutputType = {
    status: number | null
    durationMs: number | null
  }

  export type RequestLogMinAggregateOutputType = {
    id: string | null
    userId: string | null
    method: string | null
    path: string | null
    status: number | null
    ip: string | null
    durationMs: number | null
    createdAt: Date | null
  }

  export type RequestLogMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    method: string | null
    path: string | null
    status: number | null
    ip: string | null
    durationMs: number | null
    createdAt: Date | null
  }

  export type RequestLogCountAggregateOutputType = {
    id: number
    userId: number
    method: number
    path: number
    status: number
    ip: number
    durationMs: number
    createdAt: number
    _all: number
  }


  export type RequestLogAvgAggregateInputType = {
    status?: true
    durationMs?: true
  }

  export type RequestLogSumAggregateInputType = {
    status?: true
    durationMs?: true
  }

  export type RequestLogMinAggregateInputType = {
    id?: true
    userId?: true
    method?: true
    path?: true
    status?: true
    ip?: true
    durationMs?: true
    createdAt?: true
  }

  export type RequestLogMaxAggregateInputType = {
    id?: true
    userId?: true
    method?: true
    path?: true
    status?: true
    ip?: true
    durationMs?: true
    createdAt?: true
  }

  export type RequestLogCountAggregateInputType = {
    id?: true
    userId?: true
    method?: true
    path?: true
    status?: true
    ip?: true
    durationMs?: true
    createdAt?: true
    _all?: true
  }

  export type RequestLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RequestLog to aggregate.
     */
    where?: RequestLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RequestLogs to fetch.
     */
    orderBy?: RequestLogOrderByWithRelationInput | RequestLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RequestLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RequestLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RequestLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RequestLogs
    **/
    _count?: true | RequestLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RequestLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RequestLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RequestLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RequestLogMaxAggregateInputType
  }

  export type GetRequestLogAggregateType<T extends RequestLogAggregateArgs> = {
        [P in keyof T & keyof AggregateRequestLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRequestLog[P]>
      : GetScalarType<T[P], AggregateRequestLog[P]>
  }




  export type RequestLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RequestLogWhereInput
    orderBy?: RequestLogOrderByWithAggregationInput | RequestLogOrderByWithAggregationInput[]
    by: RequestLogScalarFieldEnum[] | RequestLogScalarFieldEnum
    having?: RequestLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RequestLogCountAggregateInputType | true
    _avg?: RequestLogAvgAggregateInputType
    _sum?: RequestLogSumAggregateInputType
    _min?: RequestLogMinAggregateInputType
    _max?: RequestLogMaxAggregateInputType
  }

  export type RequestLogGroupByOutputType = {
    id: string
    userId: string
    method: string
    path: string
    status: number
    ip: string | null
    durationMs: number | null
    createdAt: Date
    _count: RequestLogCountAggregateOutputType | null
    _avg: RequestLogAvgAggregateOutputType | null
    _sum: RequestLogSumAggregateOutputType | null
    _min: RequestLogMinAggregateOutputType | null
    _max: RequestLogMaxAggregateOutputType | null
  }

  type GetRequestLogGroupByPayload<T extends RequestLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RequestLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RequestLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RequestLogGroupByOutputType[P]>
            : GetScalarType<T[P], RequestLogGroupByOutputType[P]>
        }
      >
    >


  export type RequestLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    method?: boolean
    path?: boolean
    status?: boolean
    ip?: boolean
    durationMs?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["requestLog"]>

  export type RequestLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    method?: boolean
    path?: boolean
    status?: boolean
    ip?: boolean
    durationMs?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["requestLog"]>

  export type RequestLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    method?: boolean
    path?: boolean
    status?: boolean
    ip?: boolean
    durationMs?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["requestLog"]>

  export type RequestLogSelectScalar = {
    id?: boolean
    userId?: boolean
    method?: boolean
    path?: boolean
    status?: boolean
    ip?: boolean
    durationMs?: boolean
    createdAt?: boolean
  }

  export type RequestLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "method" | "path" | "status" | "ip" | "durationMs" | "createdAt", ExtArgs["result"]["requestLog"]>
  export type RequestLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type RequestLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type RequestLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $RequestLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RequestLog"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      method: string
      path: string
      status: number
      ip: string | null
      durationMs: number | null
      createdAt: Date
    }, ExtArgs["result"]["requestLog"]>
    composites: {}
  }

  type RequestLogGetPayload<S extends boolean | null | undefined | RequestLogDefaultArgs> = $Result.GetResult<Prisma.$RequestLogPayload, S>

  type RequestLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RequestLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RequestLogCountAggregateInputType | true
    }

  export interface RequestLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RequestLog'], meta: { name: 'RequestLog' } }
    /**
     * Find zero or one RequestLog that matches the filter.
     * @param {RequestLogFindUniqueArgs} args - Arguments to find a RequestLog
     * @example
     * // Get one RequestLog
     * const requestLog = await prisma.requestLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RequestLogFindUniqueArgs>(args: SelectSubset<T, RequestLogFindUniqueArgs<ExtArgs>>): Prisma__RequestLogClient<$Result.GetResult<Prisma.$RequestLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RequestLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RequestLogFindUniqueOrThrowArgs} args - Arguments to find a RequestLog
     * @example
     * // Get one RequestLog
     * const requestLog = await prisma.requestLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RequestLogFindUniqueOrThrowArgs>(args: SelectSubset<T, RequestLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RequestLogClient<$Result.GetResult<Prisma.$RequestLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RequestLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RequestLogFindFirstArgs} args - Arguments to find a RequestLog
     * @example
     * // Get one RequestLog
     * const requestLog = await prisma.requestLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RequestLogFindFirstArgs>(args?: SelectSubset<T, RequestLogFindFirstArgs<ExtArgs>>): Prisma__RequestLogClient<$Result.GetResult<Prisma.$RequestLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RequestLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RequestLogFindFirstOrThrowArgs} args - Arguments to find a RequestLog
     * @example
     * // Get one RequestLog
     * const requestLog = await prisma.requestLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RequestLogFindFirstOrThrowArgs>(args?: SelectSubset<T, RequestLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__RequestLogClient<$Result.GetResult<Prisma.$RequestLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RequestLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RequestLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RequestLogs
     * const requestLogs = await prisma.requestLog.findMany()
     * 
     * // Get first 10 RequestLogs
     * const requestLogs = await prisma.requestLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const requestLogWithIdOnly = await prisma.requestLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RequestLogFindManyArgs>(args?: SelectSubset<T, RequestLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RequestLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RequestLog.
     * @param {RequestLogCreateArgs} args - Arguments to create a RequestLog.
     * @example
     * // Create one RequestLog
     * const RequestLog = await prisma.requestLog.create({
     *   data: {
     *     // ... data to create a RequestLog
     *   }
     * })
     * 
     */
    create<T extends RequestLogCreateArgs>(args: SelectSubset<T, RequestLogCreateArgs<ExtArgs>>): Prisma__RequestLogClient<$Result.GetResult<Prisma.$RequestLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RequestLogs.
     * @param {RequestLogCreateManyArgs} args - Arguments to create many RequestLogs.
     * @example
     * // Create many RequestLogs
     * const requestLog = await prisma.requestLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RequestLogCreateManyArgs>(args?: SelectSubset<T, RequestLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RequestLogs and returns the data saved in the database.
     * @param {RequestLogCreateManyAndReturnArgs} args - Arguments to create many RequestLogs.
     * @example
     * // Create many RequestLogs
     * const requestLog = await prisma.requestLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RequestLogs and only return the `id`
     * const requestLogWithIdOnly = await prisma.requestLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RequestLogCreateManyAndReturnArgs>(args?: SelectSubset<T, RequestLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RequestLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RequestLog.
     * @param {RequestLogDeleteArgs} args - Arguments to delete one RequestLog.
     * @example
     * // Delete one RequestLog
     * const RequestLog = await prisma.requestLog.delete({
     *   where: {
     *     // ... filter to delete one RequestLog
     *   }
     * })
     * 
     */
    delete<T extends RequestLogDeleteArgs>(args: SelectSubset<T, RequestLogDeleteArgs<ExtArgs>>): Prisma__RequestLogClient<$Result.GetResult<Prisma.$RequestLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RequestLog.
     * @param {RequestLogUpdateArgs} args - Arguments to update one RequestLog.
     * @example
     * // Update one RequestLog
     * const requestLog = await prisma.requestLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RequestLogUpdateArgs>(args: SelectSubset<T, RequestLogUpdateArgs<ExtArgs>>): Prisma__RequestLogClient<$Result.GetResult<Prisma.$RequestLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RequestLogs.
     * @param {RequestLogDeleteManyArgs} args - Arguments to filter RequestLogs to delete.
     * @example
     * // Delete a few RequestLogs
     * const { count } = await prisma.requestLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RequestLogDeleteManyArgs>(args?: SelectSubset<T, RequestLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RequestLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RequestLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RequestLogs
     * const requestLog = await prisma.requestLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RequestLogUpdateManyArgs>(args: SelectSubset<T, RequestLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RequestLogs and returns the data updated in the database.
     * @param {RequestLogUpdateManyAndReturnArgs} args - Arguments to update many RequestLogs.
     * @example
     * // Update many RequestLogs
     * const requestLog = await prisma.requestLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RequestLogs and only return the `id`
     * const requestLogWithIdOnly = await prisma.requestLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RequestLogUpdateManyAndReturnArgs>(args: SelectSubset<T, RequestLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RequestLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RequestLog.
     * @param {RequestLogUpsertArgs} args - Arguments to update or create a RequestLog.
     * @example
     * // Update or create a RequestLog
     * const requestLog = await prisma.requestLog.upsert({
     *   create: {
     *     // ... data to create a RequestLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RequestLog we want to update
     *   }
     * })
     */
    upsert<T extends RequestLogUpsertArgs>(args: SelectSubset<T, RequestLogUpsertArgs<ExtArgs>>): Prisma__RequestLogClient<$Result.GetResult<Prisma.$RequestLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RequestLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RequestLogCountArgs} args - Arguments to filter RequestLogs to count.
     * @example
     * // Count the number of RequestLogs
     * const count = await prisma.requestLog.count({
     *   where: {
     *     // ... the filter for the RequestLogs we want to count
     *   }
     * })
    **/
    count<T extends RequestLogCountArgs>(
      args?: Subset<T, RequestLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RequestLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RequestLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RequestLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RequestLogAggregateArgs>(args: Subset<T, RequestLogAggregateArgs>): Prisma.PrismaPromise<GetRequestLogAggregateType<T>>

    /**
     * Group by RequestLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RequestLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RequestLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RequestLogGroupByArgs['orderBy'] }
        : { orderBy?: RequestLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RequestLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRequestLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RequestLog model
   */
  readonly fields: RequestLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RequestLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RequestLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RequestLog model
   */
  interface RequestLogFieldRefs {
    readonly id: FieldRef<"RequestLog", 'String'>
    readonly userId: FieldRef<"RequestLog", 'String'>
    readonly method: FieldRef<"RequestLog", 'String'>
    readonly path: FieldRef<"RequestLog", 'String'>
    readonly status: FieldRef<"RequestLog", 'Int'>
    readonly ip: FieldRef<"RequestLog", 'String'>
    readonly durationMs: FieldRef<"RequestLog", 'Float'>
    readonly createdAt: FieldRef<"RequestLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RequestLog findUnique
   */
  export type RequestLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestLog
     */
    select?: RequestLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestLog
     */
    omit?: RequestLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestLogInclude<ExtArgs> | null
    /**
     * Filter, which RequestLog to fetch.
     */
    where: RequestLogWhereUniqueInput
  }

  /**
   * RequestLog findUniqueOrThrow
   */
  export type RequestLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestLog
     */
    select?: RequestLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestLog
     */
    omit?: RequestLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestLogInclude<ExtArgs> | null
    /**
     * Filter, which RequestLog to fetch.
     */
    where: RequestLogWhereUniqueInput
  }

  /**
   * RequestLog findFirst
   */
  export type RequestLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestLog
     */
    select?: RequestLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestLog
     */
    omit?: RequestLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestLogInclude<ExtArgs> | null
    /**
     * Filter, which RequestLog to fetch.
     */
    where?: RequestLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RequestLogs to fetch.
     */
    orderBy?: RequestLogOrderByWithRelationInput | RequestLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RequestLogs.
     */
    cursor?: RequestLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RequestLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RequestLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RequestLogs.
     */
    distinct?: RequestLogScalarFieldEnum | RequestLogScalarFieldEnum[]
  }

  /**
   * RequestLog findFirstOrThrow
   */
  export type RequestLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestLog
     */
    select?: RequestLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestLog
     */
    omit?: RequestLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestLogInclude<ExtArgs> | null
    /**
     * Filter, which RequestLog to fetch.
     */
    where?: RequestLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RequestLogs to fetch.
     */
    orderBy?: RequestLogOrderByWithRelationInput | RequestLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RequestLogs.
     */
    cursor?: RequestLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RequestLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RequestLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RequestLogs.
     */
    distinct?: RequestLogScalarFieldEnum | RequestLogScalarFieldEnum[]
  }

  /**
   * RequestLog findMany
   */
  export type RequestLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestLog
     */
    select?: RequestLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestLog
     */
    omit?: RequestLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestLogInclude<ExtArgs> | null
    /**
     * Filter, which RequestLogs to fetch.
     */
    where?: RequestLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RequestLogs to fetch.
     */
    orderBy?: RequestLogOrderByWithRelationInput | RequestLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RequestLogs.
     */
    cursor?: RequestLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RequestLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RequestLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RequestLogs.
     */
    distinct?: RequestLogScalarFieldEnum | RequestLogScalarFieldEnum[]
  }

  /**
   * RequestLog create
   */
  export type RequestLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestLog
     */
    select?: RequestLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestLog
     */
    omit?: RequestLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestLogInclude<ExtArgs> | null
    /**
     * The data needed to create a RequestLog.
     */
    data: XOR<RequestLogCreateInput, RequestLogUncheckedCreateInput>
  }

  /**
   * RequestLog createMany
   */
  export type RequestLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RequestLogs.
     */
    data: RequestLogCreateManyInput | RequestLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RequestLog createManyAndReturn
   */
  export type RequestLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestLog
     */
    select?: RequestLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RequestLog
     */
    omit?: RequestLogOmit<ExtArgs> | null
    /**
     * The data used to create many RequestLogs.
     */
    data: RequestLogCreateManyInput | RequestLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RequestLog update
   */
  export type RequestLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestLog
     */
    select?: RequestLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestLog
     */
    omit?: RequestLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestLogInclude<ExtArgs> | null
    /**
     * The data needed to update a RequestLog.
     */
    data: XOR<RequestLogUpdateInput, RequestLogUncheckedUpdateInput>
    /**
     * Choose, which RequestLog to update.
     */
    where: RequestLogWhereUniqueInput
  }

  /**
   * RequestLog updateMany
   */
  export type RequestLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RequestLogs.
     */
    data: XOR<RequestLogUpdateManyMutationInput, RequestLogUncheckedUpdateManyInput>
    /**
     * Filter which RequestLogs to update
     */
    where?: RequestLogWhereInput
    /**
     * Limit how many RequestLogs to update.
     */
    limit?: number
  }

  /**
   * RequestLog updateManyAndReturn
   */
  export type RequestLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestLog
     */
    select?: RequestLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RequestLog
     */
    omit?: RequestLogOmit<ExtArgs> | null
    /**
     * The data used to update RequestLogs.
     */
    data: XOR<RequestLogUpdateManyMutationInput, RequestLogUncheckedUpdateManyInput>
    /**
     * Filter which RequestLogs to update
     */
    where?: RequestLogWhereInput
    /**
     * Limit how many RequestLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RequestLog upsert
   */
  export type RequestLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestLog
     */
    select?: RequestLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestLog
     */
    omit?: RequestLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestLogInclude<ExtArgs> | null
    /**
     * The filter to search for the RequestLog to update in case it exists.
     */
    where: RequestLogWhereUniqueInput
    /**
     * In case the RequestLog found by the `where` argument doesn't exist, create a new RequestLog with this data.
     */
    create: XOR<RequestLogCreateInput, RequestLogUncheckedCreateInput>
    /**
     * In case the RequestLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RequestLogUpdateInput, RequestLogUncheckedUpdateInput>
  }

  /**
   * RequestLog delete
   */
  export type RequestLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestLog
     */
    select?: RequestLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestLog
     */
    omit?: RequestLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestLogInclude<ExtArgs> | null
    /**
     * Filter which RequestLog to delete.
     */
    where: RequestLogWhereUniqueInput
  }

  /**
   * RequestLog deleteMany
   */
  export type RequestLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RequestLogs to delete
     */
    where?: RequestLogWhereInput
    /**
     * Limit how many RequestLogs to delete.
     */
    limit?: number
  }

  /**
   * RequestLog without action
   */
  export type RequestLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestLog
     */
    select?: RequestLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestLog
     */
    omit?: RequestLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestLogInclude<ExtArgs> | null
  }


  /**
   * Model UserInvitation
   */

  export type AggregateUserInvitation = {
    _count: UserInvitationCountAggregateOutputType | null
    _min: UserInvitationMinAggregateOutputType | null
    _max: UserInvitationMaxAggregateOutputType | null
  }

  export type UserInvitationMinAggregateOutputType = {
    id: string | null
    userId: string | null
    token: string | null
    createdAt: Date | null
    expiresAt: Date | null
    acceptedAt: Date | null
  }

  export type UserInvitationMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    token: string | null
    createdAt: Date | null
    expiresAt: Date | null
    acceptedAt: Date | null
  }

  export type UserInvitationCountAggregateOutputType = {
    id: number
    userId: number
    token: number
    createdAt: number
    expiresAt: number
    acceptedAt: number
    _all: number
  }


  export type UserInvitationMinAggregateInputType = {
    id?: true
    userId?: true
    token?: true
    createdAt?: true
    expiresAt?: true
    acceptedAt?: true
  }

  export type UserInvitationMaxAggregateInputType = {
    id?: true
    userId?: true
    token?: true
    createdAt?: true
    expiresAt?: true
    acceptedAt?: true
  }

  export type UserInvitationCountAggregateInputType = {
    id?: true
    userId?: true
    token?: true
    createdAt?: true
    expiresAt?: true
    acceptedAt?: true
    _all?: true
  }

  export type UserInvitationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserInvitation to aggregate.
     */
    where?: UserInvitationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserInvitations to fetch.
     */
    orderBy?: UserInvitationOrderByWithRelationInput | UserInvitationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserInvitationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserInvitations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserInvitations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserInvitations
    **/
    _count?: true | UserInvitationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserInvitationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserInvitationMaxAggregateInputType
  }

  export type GetUserInvitationAggregateType<T extends UserInvitationAggregateArgs> = {
        [P in keyof T & keyof AggregateUserInvitation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserInvitation[P]>
      : GetScalarType<T[P], AggregateUserInvitation[P]>
  }




  export type UserInvitationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserInvitationWhereInput
    orderBy?: UserInvitationOrderByWithAggregationInput | UserInvitationOrderByWithAggregationInput[]
    by: UserInvitationScalarFieldEnum[] | UserInvitationScalarFieldEnum
    having?: UserInvitationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserInvitationCountAggregateInputType | true
    _min?: UserInvitationMinAggregateInputType
    _max?: UserInvitationMaxAggregateInputType
  }

  export type UserInvitationGroupByOutputType = {
    id: string
    userId: string
    token: string
    createdAt: Date
    expiresAt: Date
    acceptedAt: Date | null
    _count: UserInvitationCountAggregateOutputType | null
    _min: UserInvitationMinAggregateOutputType | null
    _max: UserInvitationMaxAggregateOutputType | null
  }

  type GetUserInvitationGroupByPayload<T extends UserInvitationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserInvitationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserInvitationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserInvitationGroupByOutputType[P]>
            : GetScalarType<T[P], UserInvitationGroupByOutputType[P]>
        }
      >
    >


  export type UserInvitationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    token?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    acceptedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userInvitation"]>

  export type UserInvitationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    token?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    acceptedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userInvitation"]>

  export type UserInvitationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    token?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    acceptedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userInvitation"]>

  export type UserInvitationSelectScalar = {
    id?: boolean
    userId?: boolean
    token?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    acceptedAt?: boolean
  }

  export type UserInvitationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "token" | "createdAt" | "expiresAt" | "acceptedAt", ExtArgs["result"]["userInvitation"]>
  export type UserInvitationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserInvitationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserInvitationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $UserInvitationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserInvitation"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      token: string
      createdAt: Date
      expiresAt: Date
      acceptedAt: Date | null
    }, ExtArgs["result"]["userInvitation"]>
    composites: {}
  }

  type UserInvitationGetPayload<S extends boolean | null | undefined | UserInvitationDefaultArgs> = $Result.GetResult<Prisma.$UserInvitationPayload, S>

  type UserInvitationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserInvitationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserInvitationCountAggregateInputType | true
    }

  export interface UserInvitationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserInvitation'], meta: { name: 'UserInvitation' } }
    /**
     * Find zero or one UserInvitation that matches the filter.
     * @param {UserInvitationFindUniqueArgs} args - Arguments to find a UserInvitation
     * @example
     * // Get one UserInvitation
     * const userInvitation = await prisma.userInvitation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserInvitationFindUniqueArgs>(args: SelectSubset<T, UserInvitationFindUniqueArgs<ExtArgs>>): Prisma__UserInvitationClient<$Result.GetResult<Prisma.$UserInvitationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserInvitation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserInvitationFindUniqueOrThrowArgs} args - Arguments to find a UserInvitation
     * @example
     * // Get one UserInvitation
     * const userInvitation = await prisma.userInvitation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserInvitationFindUniqueOrThrowArgs>(args: SelectSubset<T, UserInvitationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserInvitationClient<$Result.GetResult<Prisma.$UserInvitationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserInvitation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserInvitationFindFirstArgs} args - Arguments to find a UserInvitation
     * @example
     * // Get one UserInvitation
     * const userInvitation = await prisma.userInvitation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserInvitationFindFirstArgs>(args?: SelectSubset<T, UserInvitationFindFirstArgs<ExtArgs>>): Prisma__UserInvitationClient<$Result.GetResult<Prisma.$UserInvitationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserInvitation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserInvitationFindFirstOrThrowArgs} args - Arguments to find a UserInvitation
     * @example
     * // Get one UserInvitation
     * const userInvitation = await prisma.userInvitation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserInvitationFindFirstOrThrowArgs>(args?: SelectSubset<T, UserInvitationFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserInvitationClient<$Result.GetResult<Prisma.$UserInvitationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserInvitations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserInvitationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserInvitations
     * const userInvitations = await prisma.userInvitation.findMany()
     * 
     * // Get first 10 UserInvitations
     * const userInvitations = await prisma.userInvitation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userInvitationWithIdOnly = await prisma.userInvitation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserInvitationFindManyArgs>(args?: SelectSubset<T, UserInvitationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserInvitationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserInvitation.
     * @param {UserInvitationCreateArgs} args - Arguments to create a UserInvitation.
     * @example
     * // Create one UserInvitation
     * const UserInvitation = await prisma.userInvitation.create({
     *   data: {
     *     // ... data to create a UserInvitation
     *   }
     * })
     * 
     */
    create<T extends UserInvitationCreateArgs>(args: SelectSubset<T, UserInvitationCreateArgs<ExtArgs>>): Prisma__UserInvitationClient<$Result.GetResult<Prisma.$UserInvitationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserInvitations.
     * @param {UserInvitationCreateManyArgs} args - Arguments to create many UserInvitations.
     * @example
     * // Create many UserInvitations
     * const userInvitation = await prisma.userInvitation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserInvitationCreateManyArgs>(args?: SelectSubset<T, UserInvitationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserInvitations and returns the data saved in the database.
     * @param {UserInvitationCreateManyAndReturnArgs} args - Arguments to create many UserInvitations.
     * @example
     * // Create many UserInvitations
     * const userInvitation = await prisma.userInvitation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserInvitations and only return the `id`
     * const userInvitationWithIdOnly = await prisma.userInvitation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserInvitationCreateManyAndReturnArgs>(args?: SelectSubset<T, UserInvitationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserInvitationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserInvitation.
     * @param {UserInvitationDeleteArgs} args - Arguments to delete one UserInvitation.
     * @example
     * // Delete one UserInvitation
     * const UserInvitation = await prisma.userInvitation.delete({
     *   where: {
     *     // ... filter to delete one UserInvitation
     *   }
     * })
     * 
     */
    delete<T extends UserInvitationDeleteArgs>(args: SelectSubset<T, UserInvitationDeleteArgs<ExtArgs>>): Prisma__UserInvitationClient<$Result.GetResult<Prisma.$UserInvitationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserInvitation.
     * @param {UserInvitationUpdateArgs} args - Arguments to update one UserInvitation.
     * @example
     * // Update one UserInvitation
     * const userInvitation = await prisma.userInvitation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserInvitationUpdateArgs>(args: SelectSubset<T, UserInvitationUpdateArgs<ExtArgs>>): Prisma__UserInvitationClient<$Result.GetResult<Prisma.$UserInvitationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserInvitations.
     * @param {UserInvitationDeleteManyArgs} args - Arguments to filter UserInvitations to delete.
     * @example
     * // Delete a few UserInvitations
     * const { count } = await prisma.userInvitation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserInvitationDeleteManyArgs>(args?: SelectSubset<T, UserInvitationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserInvitations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserInvitationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserInvitations
     * const userInvitation = await prisma.userInvitation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserInvitationUpdateManyArgs>(args: SelectSubset<T, UserInvitationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserInvitations and returns the data updated in the database.
     * @param {UserInvitationUpdateManyAndReturnArgs} args - Arguments to update many UserInvitations.
     * @example
     * // Update many UserInvitations
     * const userInvitation = await prisma.userInvitation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserInvitations and only return the `id`
     * const userInvitationWithIdOnly = await prisma.userInvitation.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserInvitationUpdateManyAndReturnArgs>(args: SelectSubset<T, UserInvitationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserInvitationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserInvitation.
     * @param {UserInvitationUpsertArgs} args - Arguments to update or create a UserInvitation.
     * @example
     * // Update or create a UserInvitation
     * const userInvitation = await prisma.userInvitation.upsert({
     *   create: {
     *     // ... data to create a UserInvitation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserInvitation we want to update
     *   }
     * })
     */
    upsert<T extends UserInvitationUpsertArgs>(args: SelectSubset<T, UserInvitationUpsertArgs<ExtArgs>>): Prisma__UserInvitationClient<$Result.GetResult<Prisma.$UserInvitationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserInvitations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserInvitationCountArgs} args - Arguments to filter UserInvitations to count.
     * @example
     * // Count the number of UserInvitations
     * const count = await prisma.userInvitation.count({
     *   where: {
     *     // ... the filter for the UserInvitations we want to count
     *   }
     * })
    **/
    count<T extends UserInvitationCountArgs>(
      args?: Subset<T, UserInvitationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserInvitationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserInvitation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserInvitationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserInvitationAggregateArgs>(args: Subset<T, UserInvitationAggregateArgs>): Prisma.PrismaPromise<GetUserInvitationAggregateType<T>>

    /**
     * Group by UserInvitation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserInvitationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserInvitationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserInvitationGroupByArgs['orderBy'] }
        : { orderBy?: UserInvitationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserInvitationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserInvitationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserInvitation model
   */
  readonly fields: UserInvitationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserInvitation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserInvitationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserInvitation model
   */
  interface UserInvitationFieldRefs {
    readonly id: FieldRef<"UserInvitation", 'String'>
    readonly userId: FieldRef<"UserInvitation", 'String'>
    readonly token: FieldRef<"UserInvitation", 'String'>
    readonly createdAt: FieldRef<"UserInvitation", 'DateTime'>
    readonly expiresAt: FieldRef<"UserInvitation", 'DateTime'>
    readonly acceptedAt: FieldRef<"UserInvitation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserInvitation findUnique
   */
  export type UserInvitationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserInvitation
     */
    select?: UserInvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserInvitation
     */
    omit?: UserInvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInvitationInclude<ExtArgs> | null
    /**
     * Filter, which UserInvitation to fetch.
     */
    where: UserInvitationWhereUniqueInput
  }

  /**
   * UserInvitation findUniqueOrThrow
   */
  export type UserInvitationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserInvitation
     */
    select?: UserInvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserInvitation
     */
    omit?: UserInvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInvitationInclude<ExtArgs> | null
    /**
     * Filter, which UserInvitation to fetch.
     */
    where: UserInvitationWhereUniqueInput
  }

  /**
   * UserInvitation findFirst
   */
  export type UserInvitationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserInvitation
     */
    select?: UserInvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserInvitation
     */
    omit?: UserInvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInvitationInclude<ExtArgs> | null
    /**
     * Filter, which UserInvitation to fetch.
     */
    where?: UserInvitationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserInvitations to fetch.
     */
    orderBy?: UserInvitationOrderByWithRelationInput | UserInvitationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserInvitations.
     */
    cursor?: UserInvitationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserInvitations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserInvitations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserInvitations.
     */
    distinct?: UserInvitationScalarFieldEnum | UserInvitationScalarFieldEnum[]
  }

  /**
   * UserInvitation findFirstOrThrow
   */
  export type UserInvitationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserInvitation
     */
    select?: UserInvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserInvitation
     */
    omit?: UserInvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInvitationInclude<ExtArgs> | null
    /**
     * Filter, which UserInvitation to fetch.
     */
    where?: UserInvitationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserInvitations to fetch.
     */
    orderBy?: UserInvitationOrderByWithRelationInput | UserInvitationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserInvitations.
     */
    cursor?: UserInvitationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserInvitations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserInvitations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserInvitations.
     */
    distinct?: UserInvitationScalarFieldEnum | UserInvitationScalarFieldEnum[]
  }

  /**
   * UserInvitation findMany
   */
  export type UserInvitationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserInvitation
     */
    select?: UserInvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserInvitation
     */
    omit?: UserInvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInvitationInclude<ExtArgs> | null
    /**
     * Filter, which UserInvitations to fetch.
     */
    where?: UserInvitationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserInvitations to fetch.
     */
    orderBy?: UserInvitationOrderByWithRelationInput | UserInvitationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserInvitations.
     */
    cursor?: UserInvitationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserInvitations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserInvitations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserInvitations.
     */
    distinct?: UserInvitationScalarFieldEnum | UserInvitationScalarFieldEnum[]
  }

  /**
   * UserInvitation create
   */
  export type UserInvitationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserInvitation
     */
    select?: UserInvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserInvitation
     */
    omit?: UserInvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInvitationInclude<ExtArgs> | null
    /**
     * The data needed to create a UserInvitation.
     */
    data: XOR<UserInvitationCreateInput, UserInvitationUncheckedCreateInput>
  }

  /**
   * UserInvitation createMany
   */
  export type UserInvitationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserInvitations.
     */
    data: UserInvitationCreateManyInput | UserInvitationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserInvitation createManyAndReturn
   */
  export type UserInvitationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserInvitation
     */
    select?: UserInvitationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserInvitation
     */
    omit?: UserInvitationOmit<ExtArgs> | null
    /**
     * The data used to create many UserInvitations.
     */
    data: UserInvitationCreateManyInput | UserInvitationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInvitationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserInvitation update
   */
  export type UserInvitationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserInvitation
     */
    select?: UserInvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserInvitation
     */
    omit?: UserInvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInvitationInclude<ExtArgs> | null
    /**
     * The data needed to update a UserInvitation.
     */
    data: XOR<UserInvitationUpdateInput, UserInvitationUncheckedUpdateInput>
    /**
     * Choose, which UserInvitation to update.
     */
    where: UserInvitationWhereUniqueInput
  }

  /**
   * UserInvitation updateMany
   */
  export type UserInvitationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserInvitations.
     */
    data: XOR<UserInvitationUpdateManyMutationInput, UserInvitationUncheckedUpdateManyInput>
    /**
     * Filter which UserInvitations to update
     */
    where?: UserInvitationWhereInput
    /**
     * Limit how many UserInvitations to update.
     */
    limit?: number
  }

  /**
   * UserInvitation updateManyAndReturn
   */
  export type UserInvitationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserInvitation
     */
    select?: UserInvitationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserInvitation
     */
    omit?: UserInvitationOmit<ExtArgs> | null
    /**
     * The data used to update UserInvitations.
     */
    data: XOR<UserInvitationUpdateManyMutationInput, UserInvitationUncheckedUpdateManyInput>
    /**
     * Filter which UserInvitations to update
     */
    where?: UserInvitationWhereInput
    /**
     * Limit how many UserInvitations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInvitationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserInvitation upsert
   */
  export type UserInvitationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserInvitation
     */
    select?: UserInvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserInvitation
     */
    omit?: UserInvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInvitationInclude<ExtArgs> | null
    /**
     * The filter to search for the UserInvitation to update in case it exists.
     */
    where: UserInvitationWhereUniqueInput
    /**
     * In case the UserInvitation found by the `where` argument doesn't exist, create a new UserInvitation with this data.
     */
    create: XOR<UserInvitationCreateInput, UserInvitationUncheckedCreateInput>
    /**
     * In case the UserInvitation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserInvitationUpdateInput, UserInvitationUncheckedUpdateInput>
  }

  /**
   * UserInvitation delete
   */
  export type UserInvitationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserInvitation
     */
    select?: UserInvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserInvitation
     */
    omit?: UserInvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInvitationInclude<ExtArgs> | null
    /**
     * Filter which UserInvitation to delete.
     */
    where: UserInvitationWhereUniqueInput
  }

  /**
   * UserInvitation deleteMany
   */
  export type UserInvitationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserInvitations to delete
     */
    where?: UserInvitationWhereInput
    /**
     * Limit how many UserInvitations to delete.
     */
    limit?: number
  }

  /**
   * UserInvitation without action
   */
  export type UserInvitationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserInvitation
     */
    select?: UserInvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserInvitation
     */
    omit?: UserInvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInvitationInclude<ExtArgs> | null
  }


  /**
   * Model DbCredentials
   */

  export type AggregateDbCredentials = {
    _count: DbCredentialsCountAggregateOutputType | null
    _avg: DbCredentialsAvgAggregateOutputType | null
    _sum: DbCredentialsSumAggregateOutputType | null
    _min: DbCredentialsMinAggregateOutputType | null
    _max: DbCredentialsMaxAggregateOutputType | null
  }

  export type DbCredentialsAvgAggregateOutputType = {
    port: number | null
    dbId: number | null
  }

  export type DbCredentialsSumAggregateOutputType = {
    port: number | null
    dbId: number | null
  }

  export type DbCredentialsMinAggregateOutputType = {
    id: string | null
    host: string | null
    port: number | null
    database: string | null
    user: string | null
    dbId: number | null
  }

  export type DbCredentialsMaxAggregateOutputType = {
    id: string | null
    host: string | null
    port: number | null
    database: string | null
    user: string | null
    dbId: number | null
  }

  export type DbCredentialsCountAggregateOutputType = {
    id: number
    host: number
    port: number
    database: number
    user: number
    dbId: number
    _all: number
  }


  export type DbCredentialsAvgAggregateInputType = {
    port?: true
    dbId?: true
  }

  export type DbCredentialsSumAggregateInputType = {
    port?: true
    dbId?: true
  }

  export type DbCredentialsMinAggregateInputType = {
    id?: true
    host?: true
    port?: true
    database?: true
    user?: true
    dbId?: true
  }

  export type DbCredentialsMaxAggregateInputType = {
    id?: true
    host?: true
    port?: true
    database?: true
    user?: true
    dbId?: true
  }

  export type DbCredentialsCountAggregateInputType = {
    id?: true
    host?: true
    port?: true
    database?: true
    user?: true
    dbId?: true
    _all?: true
  }

  export type DbCredentialsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DbCredentials to aggregate.
     */
    where?: DbCredentialsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DbCredentials to fetch.
     */
    orderBy?: DbCredentialsOrderByWithRelationInput | DbCredentialsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DbCredentialsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DbCredentials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DbCredentials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DbCredentials
    **/
    _count?: true | DbCredentialsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DbCredentialsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DbCredentialsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DbCredentialsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DbCredentialsMaxAggregateInputType
  }

  export type GetDbCredentialsAggregateType<T extends DbCredentialsAggregateArgs> = {
        [P in keyof T & keyof AggregateDbCredentials]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDbCredentials[P]>
      : GetScalarType<T[P], AggregateDbCredentials[P]>
  }




  export type DbCredentialsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DbCredentialsWhereInput
    orderBy?: DbCredentialsOrderByWithAggregationInput | DbCredentialsOrderByWithAggregationInput[]
    by: DbCredentialsScalarFieldEnum[] | DbCredentialsScalarFieldEnum
    having?: DbCredentialsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DbCredentialsCountAggregateInputType | true
    _avg?: DbCredentialsAvgAggregateInputType
    _sum?: DbCredentialsSumAggregateInputType
    _min?: DbCredentialsMinAggregateInputType
    _max?: DbCredentialsMaxAggregateInputType
  }

  export type DbCredentialsGroupByOutputType = {
    id: string
    host: string
    port: number
    database: string
    user: string
    dbId: number
    _count: DbCredentialsCountAggregateOutputType | null
    _avg: DbCredentialsAvgAggregateOutputType | null
    _sum: DbCredentialsSumAggregateOutputType | null
    _min: DbCredentialsMinAggregateOutputType | null
    _max: DbCredentialsMaxAggregateOutputType | null
  }

  type GetDbCredentialsGroupByPayload<T extends DbCredentialsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DbCredentialsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DbCredentialsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DbCredentialsGroupByOutputType[P]>
            : GetScalarType<T[P], DbCredentialsGroupByOutputType[P]>
        }
      >
    >


  export type DbCredentialsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    host?: boolean
    port?: boolean
    database?: boolean
    user?: boolean
    dbId?: boolean
    users?: boolean | DbCredentials$usersArgs<ExtArgs>
    _count?: boolean | DbCredentialsCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dbCredentials"]>

  export type DbCredentialsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    host?: boolean
    port?: boolean
    database?: boolean
    user?: boolean
    dbId?: boolean
  }, ExtArgs["result"]["dbCredentials"]>

  export type DbCredentialsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    host?: boolean
    port?: boolean
    database?: boolean
    user?: boolean
    dbId?: boolean
  }, ExtArgs["result"]["dbCredentials"]>

  export type DbCredentialsSelectScalar = {
    id?: boolean
    host?: boolean
    port?: boolean
    database?: boolean
    user?: boolean
    dbId?: boolean
  }

  export type DbCredentialsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "host" | "port" | "database" | "user" | "dbId", ExtArgs["result"]["dbCredentials"]>
  export type DbCredentialsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | DbCredentials$usersArgs<ExtArgs>
    _count?: boolean | DbCredentialsCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DbCredentialsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type DbCredentialsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $DbCredentialsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DbCredentials"
    objects: {
      users: Prisma.$UserPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      host: string
      port: number
      database: string
      user: string
      dbId: number
    }, ExtArgs["result"]["dbCredentials"]>
    composites: {}
  }

  type DbCredentialsGetPayload<S extends boolean | null | undefined | DbCredentialsDefaultArgs> = $Result.GetResult<Prisma.$DbCredentialsPayload, S>

  type DbCredentialsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DbCredentialsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DbCredentialsCountAggregateInputType | true
    }

  export interface DbCredentialsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DbCredentials'], meta: { name: 'DbCredentials' } }
    /**
     * Find zero or one DbCredentials that matches the filter.
     * @param {DbCredentialsFindUniqueArgs} args - Arguments to find a DbCredentials
     * @example
     * // Get one DbCredentials
     * const dbCredentials = await prisma.dbCredentials.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DbCredentialsFindUniqueArgs>(args: SelectSubset<T, DbCredentialsFindUniqueArgs<ExtArgs>>): Prisma__DbCredentialsClient<$Result.GetResult<Prisma.$DbCredentialsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DbCredentials that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DbCredentialsFindUniqueOrThrowArgs} args - Arguments to find a DbCredentials
     * @example
     * // Get one DbCredentials
     * const dbCredentials = await prisma.dbCredentials.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DbCredentialsFindUniqueOrThrowArgs>(args: SelectSubset<T, DbCredentialsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DbCredentialsClient<$Result.GetResult<Prisma.$DbCredentialsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DbCredentials that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DbCredentialsFindFirstArgs} args - Arguments to find a DbCredentials
     * @example
     * // Get one DbCredentials
     * const dbCredentials = await prisma.dbCredentials.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DbCredentialsFindFirstArgs>(args?: SelectSubset<T, DbCredentialsFindFirstArgs<ExtArgs>>): Prisma__DbCredentialsClient<$Result.GetResult<Prisma.$DbCredentialsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DbCredentials that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DbCredentialsFindFirstOrThrowArgs} args - Arguments to find a DbCredentials
     * @example
     * // Get one DbCredentials
     * const dbCredentials = await prisma.dbCredentials.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DbCredentialsFindFirstOrThrowArgs>(args?: SelectSubset<T, DbCredentialsFindFirstOrThrowArgs<ExtArgs>>): Prisma__DbCredentialsClient<$Result.GetResult<Prisma.$DbCredentialsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DbCredentials that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DbCredentialsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DbCredentials
     * const dbCredentials = await prisma.dbCredentials.findMany()
     * 
     * // Get first 10 DbCredentials
     * const dbCredentials = await prisma.dbCredentials.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dbCredentialsWithIdOnly = await prisma.dbCredentials.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DbCredentialsFindManyArgs>(args?: SelectSubset<T, DbCredentialsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DbCredentialsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DbCredentials.
     * @param {DbCredentialsCreateArgs} args - Arguments to create a DbCredentials.
     * @example
     * // Create one DbCredentials
     * const DbCredentials = await prisma.dbCredentials.create({
     *   data: {
     *     // ... data to create a DbCredentials
     *   }
     * })
     * 
     */
    create<T extends DbCredentialsCreateArgs>(args: SelectSubset<T, DbCredentialsCreateArgs<ExtArgs>>): Prisma__DbCredentialsClient<$Result.GetResult<Prisma.$DbCredentialsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DbCredentials.
     * @param {DbCredentialsCreateManyArgs} args - Arguments to create many DbCredentials.
     * @example
     * // Create many DbCredentials
     * const dbCredentials = await prisma.dbCredentials.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DbCredentialsCreateManyArgs>(args?: SelectSubset<T, DbCredentialsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DbCredentials and returns the data saved in the database.
     * @param {DbCredentialsCreateManyAndReturnArgs} args - Arguments to create many DbCredentials.
     * @example
     * // Create many DbCredentials
     * const dbCredentials = await prisma.dbCredentials.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DbCredentials and only return the `id`
     * const dbCredentialsWithIdOnly = await prisma.dbCredentials.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DbCredentialsCreateManyAndReturnArgs>(args?: SelectSubset<T, DbCredentialsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DbCredentialsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DbCredentials.
     * @param {DbCredentialsDeleteArgs} args - Arguments to delete one DbCredentials.
     * @example
     * // Delete one DbCredentials
     * const DbCredentials = await prisma.dbCredentials.delete({
     *   where: {
     *     // ... filter to delete one DbCredentials
     *   }
     * })
     * 
     */
    delete<T extends DbCredentialsDeleteArgs>(args: SelectSubset<T, DbCredentialsDeleteArgs<ExtArgs>>): Prisma__DbCredentialsClient<$Result.GetResult<Prisma.$DbCredentialsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DbCredentials.
     * @param {DbCredentialsUpdateArgs} args - Arguments to update one DbCredentials.
     * @example
     * // Update one DbCredentials
     * const dbCredentials = await prisma.dbCredentials.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DbCredentialsUpdateArgs>(args: SelectSubset<T, DbCredentialsUpdateArgs<ExtArgs>>): Prisma__DbCredentialsClient<$Result.GetResult<Prisma.$DbCredentialsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DbCredentials.
     * @param {DbCredentialsDeleteManyArgs} args - Arguments to filter DbCredentials to delete.
     * @example
     * // Delete a few DbCredentials
     * const { count } = await prisma.dbCredentials.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DbCredentialsDeleteManyArgs>(args?: SelectSubset<T, DbCredentialsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DbCredentials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DbCredentialsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DbCredentials
     * const dbCredentials = await prisma.dbCredentials.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DbCredentialsUpdateManyArgs>(args: SelectSubset<T, DbCredentialsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DbCredentials and returns the data updated in the database.
     * @param {DbCredentialsUpdateManyAndReturnArgs} args - Arguments to update many DbCredentials.
     * @example
     * // Update many DbCredentials
     * const dbCredentials = await prisma.dbCredentials.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DbCredentials and only return the `id`
     * const dbCredentialsWithIdOnly = await prisma.dbCredentials.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DbCredentialsUpdateManyAndReturnArgs>(args: SelectSubset<T, DbCredentialsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DbCredentialsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DbCredentials.
     * @param {DbCredentialsUpsertArgs} args - Arguments to update or create a DbCredentials.
     * @example
     * // Update or create a DbCredentials
     * const dbCredentials = await prisma.dbCredentials.upsert({
     *   create: {
     *     // ... data to create a DbCredentials
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DbCredentials we want to update
     *   }
     * })
     */
    upsert<T extends DbCredentialsUpsertArgs>(args: SelectSubset<T, DbCredentialsUpsertArgs<ExtArgs>>): Prisma__DbCredentialsClient<$Result.GetResult<Prisma.$DbCredentialsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DbCredentials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DbCredentialsCountArgs} args - Arguments to filter DbCredentials to count.
     * @example
     * // Count the number of DbCredentials
     * const count = await prisma.dbCredentials.count({
     *   where: {
     *     // ... the filter for the DbCredentials we want to count
     *   }
     * })
    **/
    count<T extends DbCredentialsCountArgs>(
      args?: Subset<T, DbCredentialsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DbCredentialsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DbCredentials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DbCredentialsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DbCredentialsAggregateArgs>(args: Subset<T, DbCredentialsAggregateArgs>): Prisma.PrismaPromise<GetDbCredentialsAggregateType<T>>

    /**
     * Group by DbCredentials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DbCredentialsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DbCredentialsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DbCredentialsGroupByArgs['orderBy'] }
        : { orderBy?: DbCredentialsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DbCredentialsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDbCredentialsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DbCredentials model
   */
  readonly fields: DbCredentialsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DbCredentials.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DbCredentialsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends DbCredentials$usersArgs<ExtArgs> = {}>(args?: Subset<T, DbCredentials$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DbCredentials model
   */
  interface DbCredentialsFieldRefs {
    readonly id: FieldRef<"DbCredentials", 'String'>
    readonly host: FieldRef<"DbCredentials", 'String'>
    readonly port: FieldRef<"DbCredentials", 'Int'>
    readonly database: FieldRef<"DbCredentials", 'String'>
    readonly user: FieldRef<"DbCredentials", 'String'>
    readonly dbId: FieldRef<"DbCredentials", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * DbCredentials findUnique
   */
  export type DbCredentialsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DbCredentials
     */
    select?: DbCredentialsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DbCredentials
     */
    omit?: DbCredentialsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DbCredentialsInclude<ExtArgs> | null
    /**
     * Filter, which DbCredentials to fetch.
     */
    where: DbCredentialsWhereUniqueInput
  }

  /**
   * DbCredentials findUniqueOrThrow
   */
  export type DbCredentialsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DbCredentials
     */
    select?: DbCredentialsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DbCredentials
     */
    omit?: DbCredentialsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DbCredentialsInclude<ExtArgs> | null
    /**
     * Filter, which DbCredentials to fetch.
     */
    where: DbCredentialsWhereUniqueInput
  }

  /**
   * DbCredentials findFirst
   */
  export type DbCredentialsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DbCredentials
     */
    select?: DbCredentialsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DbCredentials
     */
    omit?: DbCredentialsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DbCredentialsInclude<ExtArgs> | null
    /**
     * Filter, which DbCredentials to fetch.
     */
    where?: DbCredentialsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DbCredentials to fetch.
     */
    orderBy?: DbCredentialsOrderByWithRelationInput | DbCredentialsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DbCredentials.
     */
    cursor?: DbCredentialsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DbCredentials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DbCredentials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DbCredentials.
     */
    distinct?: DbCredentialsScalarFieldEnum | DbCredentialsScalarFieldEnum[]
  }

  /**
   * DbCredentials findFirstOrThrow
   */
  export type DbCredentialsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DbCredentials
     */
    select?: DbCredentialsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DbCredentials
     */
    omit?: DbCredentialsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DbCredentialsInclude<ExtArgs> | null
    /**
     * Filter, which DbCredentials to fetch.
     */
    where?: DbCredentialsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DbCredentials to fetch.
     */
    orderBy?: DbCredentialsOrderByWithRelationInput | DbCredentialsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DbCredentials.
     */
    cursor?: DbCredentialsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DbCredentials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DbCredentials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DbCredentials.
     */
    distinct?: DbCredentialsScalarFieldEnum | DbCredentialsScalarFieldEnum[]
  }

  /**
   * DbCredentials findMany
   */
  export type DbCredentialsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DbCredentials
     */
    select?: DbCredentialsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DbCredentials
     */
    omit?: DbCredentialsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DbCredentialsInclude<ExtArgs> | null
    /**
     * Filter, which DbCredentials to fetch.
     */
    where?: DbCredentialsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DbCredentials to fetch.
     */
    orderBy?: DbCredentialsOrderByWithRelationInput | DbCredentialsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DbCredentials.
     */
    cursor?: DbCredentialsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DbCredentials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DbCredentials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DbCredentials.
     */
    distinct?: DbCredentialsScalarFieldEnum | DbCredentialsScalarFieldEnum[]
  }

  /**
   * DbCredentials create
   */
  export type DbCredentialsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DbCredentials
     */
    select?: DbCredentialsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DbCredentials
     */
    omit?: DbCredentialsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DbCredentialsInclude<ExtArgs> | null
    /**
     * The data needed to create a DbCredentials.
     */
    data: XOR<DbCredentialsCreateInput, DbCredentialsUncheckedCreateInput>
  }

  /**
   * DbCredentials createMany
   */
  export type DbCredentialsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DbCredentials.
     */
    data: DbCredentialsCreateManyInput | DbCredentialsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DbCredentials createManyAndReturn
   */
  export type DbCredentialsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DbCredentials
     */
    select?: DbCredentialsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DbCredentials
     */
    omit?: DbCredentialsOmit<ExtArgs> | null
    /**
     * The data used to create many DbCredentials.
     */
    data: DbCredentialsCreateManyInput | DbCredentialsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DbCredentials update
   */
  export type DbCredentialsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DbCredentials
     */
    select?: DbCredentialsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DbCredentials
     */
    omit?: DbCredentialsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DbCredentialsInclude<ExtArgs> | null
    /**
     * The data needed to update a DbCredentials.
     */
    data: XOR<DbCredentialsUpdateInput, DbCredentialsUncheckedUpdateInput>
    /**
     * Choose, which DbCredentials to update.
     */
    where: DbCredentialsWhereUniqueInput
  }

  /**
   * DbCredentials updateMany
   */
  export type DbCredentialsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DbCredentials.
     */
    data: XOR<DbCredentialsUpdateManyMutationInput, DbCredentialsUncheckedUpdateManyInput>
    /**
     * Filter which DbCredentials to update
     */
    where?: DbCredentialsWhereInput
    /**
     * Limit how many DbCredentials to update.
     */
    limit?: number
  }

  /**
   * DbCredentials updateManyAndReturn
   */
  export type DbCredentialsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DbCredentials
     */
    select?: DbCredentialsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DbCredentials
     */
    omit?: DbCredentialsOmit<ExtArgs> | null
    /**
     * The data used to update DbCredentials.
     */
    data: XOR<DbCredentialsUpdateManyMutationInput, DbCredentialsUncheckedUpdateManyInput>
    /**
     * Filter which DbCredentials to update
     */
    where?: DbCredentialsWhereInput
    /**
     * Limit how many DbCredentials to update.
     */
    limit?: number
  }

  /**
   * DbCredentials upsert
   */
  export type DbCredentialsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DbCredentials
     */
    select?: DbCredentialsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DbCredentials
     */
    omit?: DbCredentialsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DbCredentialsInclude<ExtArgs> | null
    /**
     * The filter to search for the DbCredentials to update in case it exists.
     */
    where: DbCredentialsWhereUniqueInput
    /**
     * In case the DbCredentials found by the `where` argument doesn't exist, create a new DbCredentials with this data.
     */
    create: XOR<DbCredentialsCreateInput, DbCredentialsUncheckedCreateInput>
    /**
     * In case the DbCredentials was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DbCredentialsUpdateInput, DbCredentialsUncheckedUpdateInput>
  }

  /**
   * DbCredentials delete
   */
  export type DbCredentialsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DbCredentials
     */
    select?: DbCredentialsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DbCredentials
     */
    omit?: DbCredentialsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DbCredentialsInclude<ExtArgs> | null
    /**
     * Filter which DbCredentials to delete.
     */
    where: DbCredentialsWhereUniqueInput
  }

  /**
   * DbCredentials deleteMany
   */
  export type DbCredentialsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DbCredentials to delete
     */
    where?: DbCredentialsWhereInput
    /**
     * Limit how many DbCredentials to delete.
     */
    limit?: number
  }

  /**
   * DbCredentials.users
   */
  export type DbCredentials$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * DbCredentials without action
   */
  export type DbCredentialsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DbCredentials
     */
    select?: DbCredentialsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DbCredentials
     */
    omit?: DbCredentialsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DbCredentialsInclude<ExtArgs> | null
  }


  /**
   * Model Role
   */

  export type AggregateRole = {
    _count: RoleCountAggregateOutputType | null
    _min: RoleMinAggregateOutputType | null
    _max: RoleMaxAggregateOutputType | null
  }

  export type RoleMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
  }

  export type RoleMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
  }

  export type RoleCountAggregateOutputType = {
    id: number
    name: number
    description: number
    _all: number
  }


  export type RoleMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
  }

  export type RoleMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
  }

  export type RoleCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    _all?: true
  }

  export type RoleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Role to aggregate.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Roles
    **/
    _count?: true | RoleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RoleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RoleMaxAggregateInputType
  }

  export type GetRoleAggregateType<T extends RoleAggregateArgs> = {
        [P in keyof T & keyof AggregateRole]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRole[P]>
      : GetScalarType<T[P], AggregateRole[P]>
  }




  export type RoleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoleWhereInput
    orderBy?: RoleOrderByWithAggregationInput | RoleOrderByWithAggregationInput[]
    by: RoleScalarFieldEnum[] | RoleScalarFieldEnum
    having?: RoleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RoleCountAggregateInputType | true
    _min?: RoleMinAggregateInputType
    _max?: RoleMaxAggregateInputType
  }

  export type RoleGroupByOutputType = {
    id: string
    name: string
    description: string | null
    _count: RoleCountAggregateOutputType | null
    _min: RoleMinAggregateOutputType | null
    _max: RoleMaxAggregateOutputType | null
  }

  type GetRoleGroupByPayload<T extends RoleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RoleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RoleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RoleGroupByOutputType[P]>
            : GetScalarType<T[P], RoleGroupByOutputType[P]>
        }
      >
    >


  export type RoleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    rolePermissions?: boolean | Role$rolePermissionsArgs<ExtArgs>
    users?: boolean | Role$usersArgs<ExtArgs>
    _count?: boolean | RoleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["role"]>

  export type RoleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
  }, ExtArgs["result"]["role"]>

  export type RoleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
  }, ExtArgs["result"]["role"]>

  export type RoleSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
  }

  export type RoleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description", ExtArgs["result"]["role"]>
  export type RoleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rolePermissions?: boolean | Role$rolePermissionsArgs<ExtArgs>
    users?: boolean | Role$usersArgs<ExtArgs>
    _count?: boolean | RoleCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RoleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type RoleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $RolePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Role"
    objects: {
      rolePermissions: Prisma.$RolePermissionPayload<ExtArgs>[]
      users: Prisma.$UserPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
    }, ExtArgs["result"]["role"]>
    composites: {}
  }

  type RoleGetPayload<S extends boolean | null | undefined | RoleDefaultArgs> = $Result.GetResult<Prisma.$RolePayload, S>

  type RoleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RoleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RoleCountAggregateInputType | true
    }

  export interface RoleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Role'], meta: { name: 'Role' } }
    /**
     * Find zero or one Role that matches the filter.
     * @param {RoleFindUniqueArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RoleFindUniqueArgs>(args: SelectSubset<T, RoleFindUniqueArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Role that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RoleFindUniqueOrThrowArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RoleFindUniqueOrThrowArgs>(args: SelectSubset<T, RoleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Role that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindFirstArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RoleFindFirstArgs>(args?: SelectSubset<T, RoleFindFirstArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Role that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindFirstOrThrowArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RoleFindFirstOrThrowArgs>(args?: SelectSubset<T, RoleFindFirstOrThrowArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Roles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Roles
     * const roles = await prisma.role.findMany()
     * 
     * // Get first 10 Roles
     * const roles = await prisma.role.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const roleWithIdOnly = await prisma.role.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RoleFindManyArgs>(args?: SelectSubset<T, RoleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Role.
     * @param {RoleCreateArgs} args - Arguments to create a Role.
     * @example
     * // Create one Role
     * const Role = await prisma.role.create({
     *   data: {
     *     // ... data to create a Role
     *   }
     * })
     * 
     */
    create<T extends RoleCreateArgs>(args: SelectSubset<T, RoleCreateArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Roles.
     * @param {RoleCreateManyArgs} args - Arguments to create many Roles.
     * @example
     * // Create many Roles
     * const role = await prisma.role.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RoleCreateManyArgs>(args?: SelectSubset<T, RoleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Roles and returns the data saved in the database.
     * @param {RoleCreateManyAndReturnArgs} args - Arguments to create many Roles.
     * @example
     * // Create many Roles
     * const role = await prisma.role.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Roles and only return the `id`
     * const roleWithIdOnly = await prisma.role.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RoleCreateManyAndReturnArgs>(args?: SelectSubset<T, RoleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Role.
     * @param {RoleDeleteArgs} args - Arguments to delete one Role.
     * @example
     * // Delete one Role
     * const Role = await prisma.role.delete({
     *   where: {
     *     // ... filter to delete one Role
     *   }
     * })
     * 
     */
    delete<T extends RoleDeleteArgs>(args: SelectSubset<T, RoleDeleteArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Role.
     * @param {RoleUpdateArgs} args - Arguments to update one Role.
     * @example
     * // Update one Role
     * const role = await prisma.role.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RoleUpdateArgs>(args: SelectSubset<T, RoleUpdateArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Roles.
     * @param {RoleDeleteManyArgs} args - Arguments to filter Roles to delete.
     * @example
     * // Delete a few Roles
     * const { count } = await prisma.role.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RoleDeleteManyArgs>(args?: SelectSubset<T, RoleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Roles
     * const role = await prisma.role.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RoleUpdateManyArgs>(args: SelectSubset<T, RoleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Roles and returns the data updated in the database.
     * @param {RoleUpdateManyAndReturnArgs} args - Arguments to update many Roles.
     * @example
     * // Update many Roles
     * const role = await prisma.role.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Roles and only return the `id`
     * const roleWithIdOnly = await prisma.role.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RoleUpdateManyAndReturnArgs>(args: SelectSubset<T, RoleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Role.
     * @param {RoleUpsertArgs} args - Arguments to update or create a Role.
     * @example
     * // Update or create a Role
     * const role = await prisma.role.upsert({
     *   create: {
     *     // ... data to create a Role
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Role we want to update
     *   }
     * })
     */
    upsert<T extends RoleUpsertArgs>(args: SelectSubset<T, RoleUpsertArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleCountArgs} args - Arguments to filter Roles to count.
     * @example
     * // Count the number of Roles
     * const count = await prisma.role.count({
     *   where: {
     *     // ... the filter for the Roles we want to count
     *   }
     * })
    **/
    count<T extends RoleCountArgs>(
      args?: Subset<T, RoleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Role.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RoleAggregateArgs>(args: Subset<T, RoleAggregateArgs>): Prisma.PrismaPromise<GetRoleAggregateType<T>>

    /**
     * Group by Role.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RoleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoleGroupByArgs['orderBy'] }
        : { orderBy?: RoleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RoleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Role model
   */
  readonly fields: RoleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Role.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RoleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    rolePermissions<T extends Role$rolePermissionsArgs<ExtArgs> = {}>(args?: Subset<T, Role$rolePermissionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    users<T extends Role$usersArgs<ExtArgs> = {}>(args?: Subset<T, Role$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Role model
   */
  interface RoleFieldRefs {
    readonly id: FieldRef<"Role", 'String'>
    readonly name: FieldRef<"Role", 'String'>
    readonly description: FieldRef<"Role", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Role findUnique
   */
  export type RoleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role findUniqueOrThrow
   */
  export type RoleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role findFirst
   */
  export type RoleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Roles.
     */
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role findFirstOrThrow
   */
  export type RoleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Roles.
     */
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role findMany
   */
  export type RoleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Roles to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Roles.
     */
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role create
   */
  export type RoleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * The data needed to create a Role.
     */
    data: XOR<RoleCreateInput, RoleUncheckedCreateInput>
  }

  /**
   * Role createMany
   */
  export type RoleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Roles.
     */
    data: RoleCreateManyInput | RoleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Role createManyAndReturn
   */
  export type RoleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * The data used to create many Roles.
     */
    data: RoleCreateManyInput | RoleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Role update
   */
  export type RoleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * The data needed to update a Role.
     */
    data: XOR<RoleUpdateInput, RoleUncheckedUpdateInput>
    /**
     * Choose, which Role to update.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role updateMany
   */
  export type RoleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Roles.
     */
    data: XOR<RoleUpdateManyMutationInput, RoleUncheckedUpdateManyInput>
    /**
     * Filter which Roles to update
     */
    where?: RoleWhereInput
    /**
     * Limit how many Roles to update.
     */
    limit?: number
  }

  /**
   * Role updateManyAndReturn
   */
  export type RoleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * The data used to update Roles.
     */
    data: XOR<RoleUpdateManyMutationInput, RoleUncheckedUpdateManyInput>
    /**
     * Filter which Roles to update
     */
    where?: RoleWhereInput
    /**
     * Limit how many Roles to update.
     */
    limit?: number
  }

  /**
   * Role upsert
   */
  export type RoleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * The filter to search for the Role to update in case it exists.
     */
    where: RoleWhereUniqueInput
    /**
     * In case the Role found by the `where` argument doesn't exist, create a new Role with this data.
     */
    create: XOR<RoleCreateInput, RoleUncheckedCreateInput>
    /**
     * In case the Role was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoleUpdateInput, RoleUncheckedUpdateInput>
  }

  /**
   * Role delete
   */
  export type RoleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter which Role to delete.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role deleteMany
   */
  export type RoleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Roles to delete
     */
    where?: RoleWhereInput
    /**
     * Limit how many Roles to delete.
     */
    limit?: number
  }

  /**
   * Role.rolePermissions
   */
  export type Role$rolePermissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    where?: RolePermissionWhereInput
    orderBy?: RolePermissionOrderByWithRelationInput | RolePermissionOrderByWithRelationInput[]
    cursor?: RolePermissionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RolePermissionScalarFieldEnum | RolePermissionScalarFieldEnum[]
  }

  /**
   * Role.users
   */
  export type Role$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Role without action
   */
  export type RoleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
  }


  /**
   * Model Permission
   */

  export type AggregatePermission = {
    _count: PermissionCountAggregateOutputType | null
    _min: PermissionMinAggregateOutputType | null
    _max: PermissionMaxAggregateOutputType | null
  }

  export type PermissionMinAggregateOutputType = {
    id: string | null
    key: string | null
    name: string | null
    description: string | null
  }

  export type PermissionMaxAggregateOutputType = {
    id: string | null
    key: string | null
    name: string | null
    description: string | null
  }

  export type PermissionCountAggregateOutputType = {
    id: number
    key: number
    name: number
    description: number
    _all: number
  }


  export type PermissionMinAggregateInputType = {
    id?: true
    key?: true
    name?: true
    description?: true
  }

  export type PermissionMaxAggregateInputType = {
    id?: true
    key?: true
    name?: true
    description?: true
  }

  export type PermissionCountAggregateInputType = {
    id?: true
    key?: true
    name?: true
    description?: true
    _all?: true
  }

  export type PermissionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Permission to aggregate.
     */
    where?: PermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Permissions to fetch.
     */
    orderBy?: PermissionOrderByWithRelationInput | PermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Permissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Permissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Permissions
    **/
    _count?: true | PermissionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PermissionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PermissionMaxAggregateInputType
  }

  export type GetPermissionAggregateType<T extends PermissionAggregateArgs> = {
        [P in keyof T & keyof AggregatePermission]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePermission[P]>
      : GetScalarType<T[P], AggregatePermission[P]>
  }




  export type PermissionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PermissionWhereInput
    orderBy?: PermissionOrderByWithAggregationInput | PermissionOrderByWithAggregationInput[]
    by: PermissionScalarFieldEnum[] | PermissionScalarFieldEnum
    having?: PermissionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PermissionCountAggregateInputType | true
    _min?: PermissionMinAggregateInputType
    _max?: PermissionMaxAggregateInputType
  }

  export type PermissionGroupByOutputType = {
    id: string
    key: string
    name: string
    description: string | null
    _count: PermissionCountAggregateOutputType | null
    _min: PermissionMinAggregateOutputType | null
    _max: PermissionMaxAggregateOutputType | null
  }

  type GetPermissionGroupByPayload<T extends PermissionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PermissionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PermissionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PermissionGroupByOutputType[P]>
            : GetScalarType<T[P], PermissionGroupByOutputType[P]>
        }
      >
    >


  export type PermissionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    name?: boolean
    description?: boolean
    rolePermissions?: boolean | Permission$rolePermissionsArgs<ExtArgs>
    _count?: boolean | PermissionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["permission"]>

  export type PermissionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    name?: boolean
    description?: boolean
  }, ExtArgs["result"]["permission"]>

  export type PermissionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    name?: boolean
    description?: boolean
  }, ExtArgs["result"]["permission"]>

  export type PermissionSelectScalar = {
    id?: boolean
    key?: boolean
    name?: boolean
    description?: boolean
  }

  export type PermissionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "key" | "name" | "description", ExtArgs["result"]["permission"]>
  export type PermissionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rolePermissions?: boolean | Permission$rolePermissionsArgs<ExtArgs>
    _count?: boolean | PermissionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PermissionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type PermissionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PermissionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Permission"
    objects: {
      rolePermissions: Prisma.$RolePermissionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      key: string
      name: string
      description: string | null
    }, ExtArgs["result"]["permission"]>
    composites: {}
  }

  type PermissionGetPayload<S extends boolean | null | undefined | PermissionDefaultArgs> = $Result.GetResult<Prisma.$PermissionPayload, S>

  type PermissionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PermissionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PermissionCountAggregateInputType | true
    }

  export interface PermissionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Permission'], meta: { name: 'Permission' } }
    /**
     * Find zero or one Permission that matches the filter.
     * @param {PermissionFindUniqueArgs} args - Arguments to find a Permission
     * @example
     * // Get one Permission
     * const permission = await prisma.permission.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PermissionFindUniqueArgs>(args: SelectSubset<T, PermissionFindUniqueArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Permission that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PermissionFindUniqueOrThrowArgs} args - Arguments to find a Permission
     * @example
     * // Get one Permission
     * const permission = await prisma.permission.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PermissionFindUniqueOrThrowArgs>(args: SelectSubset<T, PermissionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Permission that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionFindFirstArgs} args - Arguments to find a Permission
     * @example
     * // Get one Permission
     * const permission = await prisma.permission.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PermissionFindFirstArgs>(args?: SelectSubset<T, PermissionFindFirstArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Permission that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionFindFirstOrThrowArgs} args - Arguments to find a Permission
     * @example
     * // Get one Permission
     * const permission = await prisma.permission.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PermissionFindFirstOrThrowArgs>(args?: SelectSubset<T, PermissionFindFirstOrThrowArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Permissions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Permissions
     * const permissions = await prisma.permission.findMany()
     * 
     * // Get first 10 Permissions
     * const permissions = await prisma.permission.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const permissionWithIdOnly = await prisma.permission.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PermissionFindManyArgs>(args?: SelectSubset<T, PermissionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Permission.
     * @param {PermissionCreateArgs} args - Arguments to create a Permission.
     * @example
     * // Create one Permission
     * const Permission = await prisma.permission.create({
     *   data: {
     *     // ... data to create a Permission
     *   }
     * })
     * 
     */
    create<T extends PermissionCreateArgs>(args: SelectSubset<T, PermissionCreateArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Permissions.
     * @param {PermissionCreateManyArgs} args - Arguments to create many Permissions.
     * @example
     * // Create many Permissions
     * const permission = await prisma.permission.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PermissionCreateManyArgs>(args?: SelectSubset<T, PermissionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Permissions and returns the data saved in the database.
     * @param {PermissionCreateManyAndReturnArgs} args - Arguments to create many Permissions.
     * @example
     * // Create many Permissions
     * const permission = await prisma.permission.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Permissions and only return the `id`
     * const permissionWithIdOnly = await prisma.permission.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PermissionCreateManyAndReturnArgs>(args?: SelectSubset<T, PermissionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Permission.
     * @param {PermissionDeleteArgs} args - Arguments to delete one Permission.
     * @example
     * // Delete one Permission
     * const Permission = await prisma.permission.delete({
     *   where: {
     *     // ... filter to delete one Permission
     *   }
     * })
     * 
     */
    delete<T extends PermissionDeleteArgs>(args: SelectSubset<T, PermissionDeleteArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Permission.
     * @param {PermissionUpdateArgs} args - Arguments to update one Permission.
     * @example
     * // Update one Permission
     * const permission = await prisma.permission.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PermissionUpdateArgs>(args: SelectSubset<T, PermissionUpdateArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Permissions.
     * @param {PermissionDeleteManyArgs} args - Arguments to filter Permissions to delete.
     * @example
     * // Delete a few Permissions
     * const { count } = await prisma.permission.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PermissionDeleteManyArgs>(args?: SelectSubset<T, PermissionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Permissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Permissions
     * const permission = await prisma.permission.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PermissionUpdateManyArgs>(args: SelectSubset<T, PermissionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Permissions and returns the data updated in the database.
     * @param {PermissionUpdateManyAndReturnArgs} args - Arguments to update many Permissions.
     * @example
     * // Update many Permissions
     * const permission = await prisma.permission.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Permissions and only return the `id`
     * const permissionWithIdOnly = await prisma.permission.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PermissionUpdateManyAndReturnArgs>(args: SelectSubset<T, PermissionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Permission.
     * @param {PermissionUpsertArgs} args - Arguments to update or create a Permission.
     * @example
     * // Update or create a Permission
     * const permission = await prisma.permission.upsert({
     *   create: {
     *     // ... data to create a Permission
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Permission we want to update
     *   }
     * })
     */
    upsert<T extends PermissionUpsertArgs>(args: SelectSubset<T, PermissionUpsertArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Permissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionCountArgs} args - Arguments to filter Permissions to count.
     * @example
     * // Count the number of Permissions
     * const count = await prisma.permission.count({
     *   where: {
     *     // ... the filter for the Permissions we want to count
     *   }
     * })
    **/
    count<T extends PermissionCountArgs>(
      args?: Subset<T, PermissionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PermissionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Permission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PermissionAggregateArgs>(args: Subset<T, PermissionAggregateArgs>): Prisma.PrismaPromise<GetPermissionAggregateType<T>>

    /**
     * Group by Permission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PermissionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PermissionGroupByArgs['orderBy'] }
        : { orderBy?: PermissionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PermissionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPermissionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Permission model
   */
  readonly fields: PermissionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Permission.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PermissionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    rolePermissions<T extends Permission$rolePermissionsArgs<ExtArgs> = {}>(args?: Subset<T, Permission$rolePermissionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Permission model
   */
  interface PermissionFieldRefs {
    readonly id: FieldRef<"Permission", 'String'>
    readonly key: FieldRef<"Permission", 'String'>
    readonly name: FieldRef<"Permission", 'String'>
    readonly description: FieldRef<"Permission", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Permission findUnique
   */
  export type PermissionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * Filter, which Permission to fetch.
     */
    where: PermissionWhereUniqueInput
  }

  /**
   * Permission findUniqueOrThrow
   */
  export type PermissionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * Filter, which Permission to fetch.
     */
    where: PermissionWhereUniqueInput
  }

  /**
   * Permission findFirst
   */
  export type PermissionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * Filter, which Permission to fetch.
     */
    where?: PermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Permissions to fetch.
     */
    orderBy?: PermissionOrderByWithRelationInput | PermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Permissions.
     */
    cursor?: PermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Permissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Permissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Permissions.
     */
    distinct?: PermissionScalarFieldEnum | PermissionScalarFieldEnum[]
  }

  /**
   * Permission findFirstOrThrow
   */
  export type PermissionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * Filter, which Permission to fetch.
     */
    where?: PermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Permissions to fetch.
     */
    orderBy?: PermissionOrderByWithRelationInput | PermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Permissions.
     */
    cursor?: PermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Permissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Permissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Permissions.
     */
    distinct?: PermissionScalarFieldEnum | PermissionScalarFieldEnum[]
  }

  /**
   * Permission findMany
   */
  export type PermissionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * Filter, which Permissions to fetch.
     */
    where?: PermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Permissions to fetch.
     */
    orderBy?: PermissionOrderByWithRelationInput | PermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Permissions.
     */
    cursor?: PermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Permissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Permissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Permissions.
     */
    distinct?: PermissionScalarFieldEnum | PermissionScalarFieldEnum[]
  }

  /**
   * Permission create
   */
  export type PermissionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * The data needed to create a Permission.
     */
    data: XOR<PermissionCreateInput, PermissionUncheckedCreateInput>
  }

  /**
   * Permission createMany
   */
  export type PermissionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Permissions.
     */
    data: PermissionCreateManyInput | PermissionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Permission createManyAndReturn
   */
  export type PermissionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * The data used to create many Permissions.
     */
    data: PermissionCreateManyInput | PermissionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Permission update
   */
  export type PermissionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * The data needed to update a Permission.
     */
    data: XOR<PermissionUpdateInput, PermissionUncheckedUpdateInput>
    /**
     * Choose, which Permission to update.
     */
    where: PermissionWhereUniqueInput
  }

  /**
   * Permission updateMany
   */
  export type PermissionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Permissions.
     */
    data: XOR<PermissionUpdateManyMutationInput, PermissionUncheckedUpdateManyInput>
    /**
     * Filter which Permissions to update
     */
    where?: PermissionWhereInput
    /**
     * Limit how many Permissions to update.
     */
    limit?: number
  }

  /**
   * Permission updateManyAndReturn
   */
  export type PermissionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * The data used to update Permissions.
     */
    data: XOR<PermissionUpdateManyMutationInput, PermissionUncheckedUpdateManyInput>
    /**
     * Filter which Permissions to update
     */
    where?: PermissionWhereInput
    /**
     * Limit how many Permissions to update.
     */
    limit?: number
  }

  /**
   * Permission upsert
   */
  export type PermissionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * The filter to search for the Permission to update in case it exists.
     */
    where: PermissionWhereUniqueInput
    /**
     * In case the Permission found by the `where` argument doesn't exist, create a new Permission with this data.
     */
    create: XOR<PermissionCreateInput, PermissionUncheckedCreateInput>
    /**
     * In case the Permission was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PermissionUpdateInput, PermissionUncheckedUpdateInput>
  }

  /**
   * Permission delete
   */
  export type PermissionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * Filter which Permission to delete.
     */
    where: PermissionWhereUniqueInput
  }

  /**
   * Permission deleteMany
   */
  export type PermissionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Permissions to delete
     */
    where?: PermissionWhereInput
    /**
     * Limit how many Permissions to delete.
     */
    limit?: number
  }

  /**
   * Permission.rolePermissions
   */
  export type Permission$rolePermissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    where?: RolePermissionWhereInput
    orderBy?: RolePermissionOrderByWithRelationInput | RolePermissionOrderByWithRelationInput[]
    cursor?: RolePermissionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RolePermissionScalarFieldEnum | RolePermissionScalarFieldEnum[]
  }

  /**
   * Permission without action
   */
  export type PermissionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
  }


  /**
   * Model RolePermission
   */

  export type AggregateRolePermission = {
    _count: RolePermissionCountAggregateOutputType | null
    _min: RolePermissionMinAggregateOutputType | null
    _max: RolePermissionMaxAggregateOutputType | null
  }

  export type RolePermissionMinAggregateOutputType = {
    roleId: string | null
    permissionId: string | null
  }

  export type RolePermissionMaxAggregateOutputType = {
    roleId: string | null
    permissionId: string | null
  }

  export type RolePermissionCountAggregateOutputType = {
    roleId: number
    permissionId: number
    _all: number
  }


  export type RolePermissionMinAggregateInputType = {
    roleId?: true
    permissionId?: true
  }

  export type RolePermissionMaxAggregateInputType = {
    roleId?: true
    permissionId?: true
  }

  export type RolePermissionCountAggregateInputType = {
    roleId?: true
    permissionId?: true
    _all?: true
  }

  export type RolePermissionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RolePermission to aggregate.
     */
    where?: RolePermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RolePermissions to fetch.
     */
    orderBy?: RolePermissionOrderByWithRelationInput | RolePermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RolePermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RolePermissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RolePermissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RolePermissions
    **/
    _count?: true | RolePermissionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RolePermissionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RolePermissionMaxAggregateInputType
  }

  export type GetRolePermissionAggregateType<T extends RolePermissionAggregateArgs> = {
        [P in keyof T & keyof AggregateRolePermission]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRolePermission[P]>
      : GetScalarType<T[P], AggregateRolePermission[P]>
  }




  export type RolePermissionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RolePermissionWhereInput
    orderBy?: RolePermissionOrderByWithAggregationInput | RolePermissionOrderByWithAggregationInput[]
    by: RolePermissionScalarFieldEnum[] | RolePermissionScalarFieldEnum
    having?: RolePermissionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RolePermissionCountAggregateInputType | true
    _min?: RolePermissionMinAggregateInputType
    _max?: RolePermissionMaxAggregateInputType
  }

  export type RolePermissionGroupByOutputType = {
    roleId: string
    permissionId: string
    _count: RolePermissionCountAggregateOutputType | null
    _min: RolePermissionMinAggregateOutputType | null
    _max: RolePermissionMaxAggregateOutputType | null
  }

  type GetRolePermissionGroupByPayload<T extends RolePermissionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RolePermissionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RolePermissionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RolePermissionGroupByOutputType[P]>
            : GetScalarType<T[P], RolePermissionGroupByOutputType[P]>
        }
      >
    >


  export type RolePermissionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    roleId?: boolean
    permissionId?: boolean
    permission?: boolean | PermissionDefaultArgs<ExtArgs>
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rolePermission"]>

  export type RolePermissionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    roleId?: boolean
    permissionId?: boolean
    permission?: boolean | PermissionDefaultArgs<ExtArgs>
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rolePermission"]>

  export type RolePermissionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    roleId?: boolean
    permissionId?: boolean
    permission?: boolean | PermissionDefaultArgs<ExtArgs>
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rolePermission"]>

  export type RolePermissionSelectScalar = {
    roleId?: boolean
    permissionId?: boolean
  }

  export type RolePermissionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"roleId" | "permissionId", ExtArgs["result"]["rolePermission"]>
  export type RolePermissionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    permission?: boolean | PermissionDefaultArgs<ExtArgs>
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }
  export type RolePermissionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    permission?: boolean | PermissionDefaultArgs<ExtArgs>
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }
  export type RolePermissionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    permission?: boolean | PermissionDefaultArgs<ExtArgs>
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }

  export type $RolePermissionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RolePermission"
    objects: {
      permission: Prisma.$PermissionPayload<ExtArgs>
      role: Prisma.$RolePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      roleId: string
      permissionId: string
    }, ExtArgs["result"]["rolePermission"]>
    composites: {}
  }

  type RolePermissionGetPayload<S extends boolean | null | undefined | RolePermissionDefaultArgs> = $Result.GetResult<Prisma.$RolePermissionPayload, S>

  type RolePermissionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RolePermissionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RolePermissionCountAggregateInputType | true
    }

  export interface RolePermissionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RolePermission'], meta: { name: 'RolePermission' } }
    /**
     * Find zero or one RolePermission that matches the filter.
     * @param {RolePermissionFindUniqueArgs} args - Arguments to find a RolePermission
     * @example
     * // Get one RolePermission
     * const rolePermission = await prisma.rolePermission.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RolePermissionFindUniqueArgs>(args: SelectSubset<T, RolePermissionFindUniqueArgs<ExtArgs>>): Prisma__RolePermissionClient<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RolePermission that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RolePermissionFindUniqueOrThrowArgs} args - Arguments to find a RolePermission
     * @example
     * // Get one RolePermission
     * const rolePermission = await prisma.rolePermission.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RolePermissionFindUniqueOrThrowArgs>(args: SelectSubset<T, RolePermissionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RolePermissionClient<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RolePermission that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolePermissionFindFirstArgs} args - Arguments to find a RolePermission
     * @example
     * // Get one RolePermission
     * const rolePermission = await prisma.rolePermission.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RolePermissionFindFirstArgs>(args?: SelectSubset<T, RolePermissionFindFirstArgs<ExtArgs>>): Prisma__RolePermissionClient<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RolePermission that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolePermissionFindFirstOrThrowArgs} args - Arguments to find a RolePermission
     * @example
     * // Get one RolePermission
     * const rolePermission = await prisma.rolePermission.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RolePermissionFindFirstOrThrowArgs>(args?: SelectSubset<T, RolePermissionFindFirstOrThrowArgs<ExtArgs>>): Prisma__RolePermissionClient<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RolePermissions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolePermissionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RolePermissions
     * const rolePermissions = await prisma.rolePermission.findMany()
     * 
     * // Get first 10 RolePermissions
     * const rolePermissions = await prisma.rolePermission.findMany({ take: 10 })
     * 
     * // Only select the `roleId`
     * const rolePermissionWithRoleIdOnly = await prisma.rolePermission.findMany({ select: { roleId: true } })
     * 
     */
    findMany<T extends RolePermissionFindManyArgs>(args?: SelectSubset<T, RolePermissionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RolePermission.
     * @param {RolePermissionCreateArgs} args - Arguments to create a RolePermission.
     * @example
     * // Create one RolePermission
     * const RolePermission = await prisma.rolePermission.create({
     *   data: {
     *     // ... data to create a RolePermission
     *   }
     * })
     * 
     */
    create<T extends RolePermissionCreateArgs>(args: SelectSubset<T, RolePermissionCreateArgs<ExtArgs>>): Prisma__RolePermissionClient<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RolePermissions.
     * @param {RolePermissionCreateManyArgs} args - Arguments to create many RolePermissions.
     * @example
     * // Create many RolePermissions
     * const rolePermission = await prisma.rolePermission.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RolePermissionCreateManyArgs>(args?: SelectSubset<T, RolePermissionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RolePermissions and returns the data saved in the database.
     * @param {RolePermissionCreateManyAndReturnArgs} args - Arguments to create many RolePermissions.
     * @example
     * // Create many RolePermissions
     * const rolePermission = await prisma.rolePermission.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RolePermissions and only return the `roleId`
     * const rolePermissionWithRoleIdOnly = await prisma.rolePermission.createManyAndReturn({
     *   select: { roleId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RolePermissionCreateManyAndReturnArgs>(args?: SelectSubset<T, RolePermissionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RolePermission.
     * @param {RolePermissionDeleteArgs} args - Arguments to delete one RolePermission.
     * @example
     * // Delete one RolePermission
     * const RolePermission = await prisma.rolePermission.delete({
     *   where: {
     *     // ... filter to delete one RolePermission
     *   }
     * })
     * 
     */
    delete<T extends RolePermissionDeleteArgs>(args: SelectSubset<T, RolePermissionDeleteArgs<ExtArgs>>): Prisma__RolePermissionClient<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RolePermission.
     * @param {RolePermissionUpdateArgs} args - Arguments to update one RolePermission.
     * @example
     * // Update one RolePermission
     * const rolePermission = await prisma.rolePermission.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RolePermissionUpdateArgs>(args: SelectSubset<T, RolePermissionUpdateArgs<ExtArgs>>): Prisma__RolePermissionClient<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RolePermissions.
     * @param {RolePermissionDeleteManyArgs} args - Arguments to filter RolePermissions to delete.
     * @example
     * // Delete a few RolePermissions
     * const { count } = await prisma.rolePermission.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RolePermissionDeleteManyArgs>(args?: SelectSubset<T, RolePermissionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RolePermissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolePermissionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RolePermissions
     * const rolePermission = await prisma.rolePermission.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RolePermissionUpdateManyArgs>(args: SelectSubset<T, RolePermissionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RolePermissions and returns the data updated in the database.
     * @param {RolePermissionUpdateManyAndReturnArgs} args - Arguments to update many RolePermissions.
     * @example
     * // Update many RolePermissions
     * const rolePermission = await prisma.rolePermission.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RolePermissions and only return the `roleId`
     * const rolePermissionWithRoleIdOnly = await prisma.rolePermission.updateManyAndReturn({
     *   select: { roleId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RolePermissionUpdateManyAndReturnArgs>(args: SelectSubset<T, RolePermissionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RolePermission.
     * @param {RolePermissionUpsertArgs} args - Arguments to update or create a RolePermission.
     * @example
     * // Update or create a RolePermission
     * const rolePermission = await prisma.rolePermission.upsert({
     *   create: {
     *     // ... data to create a RolePermission
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RolePermission we want to update
     *   }
     * })
     */
    upsert<T extends RolePermissionUpsertArgs>(args: SelectSubset<T, RolePermissionUpsertArgs<ExtArgs>>): Prisma__RolePermissionClient<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RolePermissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolePermissionCountArgs} args - Arguments to filter RolePermissions to count.
     * @example
     * // Count the number of RolePermissions
     * const count = await prisma.rolePermission.count({
     *   where: {
     *     // ... the filter for the RolePermissions we want to count
     *   }
     * })
    **/
    count<T extends RolePermissionCountArgs>(
      args?: Subset<T, RolePermissionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RolePermissionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RolePermission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolePermissionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RolePermissionAggregateArgs>(args: Subset<T, RolePermissionAggregateArgs>): Prisma.PrismaPromise<GetRolePermissionAggregateType<T>>

    /**
     * Group by RolePermission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolePermissionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RolePermissionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RolePermissionGroupByArgs['orderBy'] }
        : { orderBy?: RolePermissionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RolePermissionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRolePermissionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RolePermission model
   */
  readonly fields: RolePermissionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RolePermission.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RolePermissionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    permission<T extends PermissionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PermissionDefaultArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    role<T extends RoleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RoleDefaultArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RolePermission model
   */
  interface RolePermissionFieldRefs {
    readonly roleId: FieldRef<"RolePermission", 'String'>
    readonly permissionId: FieldRef<"RolePermission", 'String'>
  }
    

  // Custom InputTypes
  /**
   * RolePermission findUnique
   */
  export type RolePermissionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    /**
     * Filter, which RolePermission to fetch.
     */
    where: RolePermissionWhereUniqueInput
  }

  /**
   * RolePermission findUniqueOrThrow
   */
  export type RolePermissionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    /**
     * Filter, which RolePermission to fetch.
     */
    where: RolePermissionWhereUniqueInput
  }

  /**
   * RolePermission findFirst
   */
  export type RolePermissionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    /**
     * Filter, which RolePermission to fetch.
     */
    where?: RolePermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RolePermissions to fetch.
     */
    orderBy?: RolePermissionOrderByWithRelationInput | RolePermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RolePermissions.
     */
    cursor?: RolePermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RolePermissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RolePermissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RolePermissions.
     */
    distinct?: RolePermissionScalarFieldEnum | RolePermissionScalarFieldEnum[]
  }

  /**
   * RolePermission findFirstOrThrow
   */
  export type RolePermissionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    /**
     * Filter, which RolePermission to fetch.
     */
    where?: RolePermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RolePermissions to fetch.
     */
    orderBy?: RolePermissionOrderByWithRelationInput | RolePermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RolePermissions.
     */
    cursor?: RolePermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RolePermissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RolePermissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RolePermissions.
     */
    distinct?: RolePermissionScalarFieldEnum | RolePermissionScalarFieldEnum[]
  }

  /**
   * RolePermission findMany
   */
  export type RolePermissionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    /**
     * Filter, which RolePermissions to fetch.
     */
    where?: RolePermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RolePermissions to fetch.
     */
    orderBy?: RolePermissionOrderByWithRelationInput | RolePermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RolePermissions.
     */
    cursor?: RolePermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RolePermissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RolePermissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RolePermissions.
     */
    distinct?: RolePermissionScalarFieldEnum | RolePermissionScalarFieldEnum[]
  }

  /**
   * RolePermission create
   */
  export type RolePermissionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    /**
     * The data needed to create a RolePermission.
     */
    data: XOR<RolePermissionCreateInput, RolePermissionUncheckedCreateInput>
  }

  /**
   * RolePermission createMany
   */
  export type RolePermissionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RolePermissions.
     */
    data: RolePermissionCreateManyInput | RolePermissionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RolePermission createManyAndReturn
   */
  export type RolePermissionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * The data used to create many RolePermissions.
     */
    data: RolePermissionCreateManyInput | RolePermissionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RolePermission update
   */
  export type RolePermissionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    /**
     * The data needed to update a RolePermission.
     */
    data: XOR<RolePermissionUpdateInput, RolePermissionUncheckedUpdateInput>
    /**
     * Choose, which RolePermission to update.
     */
    where: RolePermissionWhereUniqueInput
  }

  /**
   * RolePermission updateMany
   */
  export type RolePermissionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RolePermissions.
     */
    data: XOR<RolePermissionUpdateManyMutationInput, RolePermissionUncheckedUpdateManyInput>
    /**
     * Filter which RolePermissions to update
     */
    where?: RolePermissionWhereInput
    /**
     * Limit how many RolePermissions to update.
     */
    limit?: number
  }

  /**
   * RolePermission updateManyAndReturn
   */
  export type RolePermissionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * The data used to update RolePermissions.
     */
    data: XOR<RolePermissionUpdateManyMutationInput, RolePermissionUncheckedUpdateManyInput>
    /**
     * Filter which RolePermissions to update
     */
    where?: RolePermissionWhereInput
    /**
     * Limit how many RolePermissions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RolePermission upsert
   */
  export type RolePermissionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    /**
     * The filter to search for the RolePermission to update in case it exists.
     */
    where: RolePermissionWhereUniqueInput
    /**
     * In case the RolePermission found by the `where` argument doesn't exist, create a new RolePermission with this data.
     */
    create: XOR<RolePermissionCreateInput, RolePermissionUncheckedCreateInput>
    /**
     * In case the RolePermission was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RolePermissionUpdateInput, RolePermissionUncheckedUpdateInput>
  }

  /**
   * RolePermission delete
   */
  export type RolePermissionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    /**
     * Filter which RolePermission to delete.
     */
    where: RolePermissionWhereUniqueInput
  }

  /**
   * RolePermission deleteMany
   */
  export type RolePermissionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RolePermissions to delete
     */
    where?: RolePermissionWhereInput
    /**
     * Limit how many RolePermissions to delete.
     */
    limit?: number
  }

  /**
   * RolePermission without action
   */
  export type RolePermissionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
  }


  /**
   * Model IntegrationRequest
   */

  export type AggregateIntegrationRequest = {
    _count: IntegrationRequestCountAggregateOutputType | null
    _min: IntegrationRequestMinAggregateOutputType | null
    _max: IntegrationRequestMaxAggregateOutputType | null
  }

  export type IntegrationRequestMinAggregateOutputType = {
    id: string | null
    clientName: string | null
    hostingType: $Enums.HostingType | null
    fixedIp: string | null
    objective: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
    cnpj: string | null
    legalName: string | null
    rejectionReason: string | null
  }

  export type IntegrationRequestMaxAggregateOutputType = {
    id: string | null
    clientName: string | null
    hostingType: $Enums.HostingType | null
    fixedIp: string | null
    objective: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
    cnpj: string | null
    legalName: string | null
    rejectionReason: string | null
  }

  export type IntegrationRequestCountAggregateOutputType = {
    id: number
    clientName: number
    hostingType: number
    fixedIp: number
    database: number
    scopes: number
    objective: number
    technicalContact: number
    responsiblePerson: number
    status: number
    createdAt: number
    updatedAt: number
    modules: number
    cnpj: number
    legalName: number
    rejectionReason: number
    _all: number
  }


  export type IntegrationRequestMinAggregateInputType = {
    id?: true
    clientName?: true
    hostingType?: true
    fixedIp?: true
    objective?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    cnpj?: true
    legalName?: true
    rejectionReason?: true
  }

  export type IntegrationRequestMaxAggregateInputType = {
    id?: true
    clientName?: true
    hostingType?: true
    fixedIp?: true
    objective?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    cnpj?: true
    legalName?: true
    rejectionReason?: true
  }

  export type IntegrationRequestCountAggregateInputType = {
    id?: true
    clientName?: true
    hostingType?: true
    fixedIp?: true
    database?: true
    scopes?: true
    objective?: true
    technicalContact?: true
    responsiblePerson?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    modules?: true
    cnpj?: true
    legalName?: true
    rejectionReason?: true
    _all?: true
  }

  export type IntegrationRequestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which IntegrationRequest to aggregate.
     */
    where?: IntegrationRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IntegrationRequests to fetch.
     */
    orderBy?: IntegrationRequestOrderByWithRelationInput | IntegrationRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: IntegrationRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IntegrationRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IntegrationRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned IntegrationRequests
    **/
    _count?: true | IntegrationRequestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: IntegrationRequestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: IntegrationRequestMaxAggregateInputType
  }

  export type GetIntegrationRequestAggregateType<T extends IntegrationRequestAggregateArgs> = {
        [P in keyof T & keyof AggregateIntegrationRequest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateIntegrationRequest[P]>
      : GetScalarType<T[P], AggregateIntegrationRequest[P]>
  }




  export type IntegrationRequestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: IntegrationRequestWhereInput
    orderBy?: IntegrationRequestOrderByWithAggregationInput | IntegrationRequestOrderByWithAggregationInput[]
    by: IntegrationRequestScalarFieldEnum[] | IntegrationRequestScalarFieldEnum
    having?: IntegrationRequestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: IntegrationRequestCountAggregateInputType | true
    _min?: IntegrationRequestMinAggregateInputType
    _max?: IntegrationRequestMaxAggregateInputType
  }

  export type IntegrationRequestGroupByOutputType = {
    id: string
    clientName: string
    hostingType: $Enums.HostingType
    fixedIp: string | null
    database: JsonValue
    scopes: JsonValue
    objective: string
    technicalContact: JsonValue
    responsiblePerson: JsonValue
    status: string
    createdAt: Date
    updatedAt: Date
    modules: string[]
    cnpj: string | null
    legalName: string
    rejectionReason: string | null
    _count: IntegrationRequestCountAggregateOutputType | null
    _min: IntegrationRequestMinAggregateOutputType | null
    _max: IntegrationRequestMaxAggregateOutputType | null
  }

  type GetIntegrationRequestGroupByPayload<T extends IntegrationRequestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<IntegrationRequestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof IntegrationRequestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], IntegrationRequestGroupByOutputType[P]>
            : GetScalarType<T[P], IntegrationRequestGroupByOutputType[P]>
        }
      >
    >


  export type IntegrationRequestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clientName?: boolean
    hostingType?: boolean
    fixedIp?: boolean
    database?: boolean
    scopes?: boolean
    objective?: boolean
    technicalContact?: boolean
    responsiblePerson?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    modules?: boolean
    cnpj?: boolean
    legalName?: boolean
    rejectionReason?: boolean
  }, ExtArgs["result"]["integrationRequest"]>

  export type IntegrationRequestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clientName?: boolean
    hostingType?: boolean
    fixedIp?: boolean
    database?: boolean
    scopes?: boolean
    objective?: boolean
    technicalContact?: boolean
    responsiblePerson?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    modules?: boolean
    cnpj?: boolean
    legalName?: boolean
    rejectionReason?: boolean
  }, ExtArgs["result"]["integrationRequest"]>

  export type IntegrationRequestSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clientName?: boolean
    hostingType?: boolean
    fixedIp?: boolean
    database?: boolean
    scopes?: boolean
    objective?: boolean
    technicalContact?: boolean
    responsiblePerson?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    modules?: boolean
    cnpj?: boolean
    legalName?: boolean
    rejectionReason?: boolean
  }, ExtArgs["result"]["integrationRequest"]>

  export type IntegrationRequestSelectScalar = {
    id?: boolean
    clientName?: boolean
    hostingType?: boolean
    fixedIp?: boolean
    database?: boolean
    scopes?: boolean
    objective?: boolean
    technicalContact?: boolean
    responsiblePerson?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    modules?: boolean
    cnpj?: boolean
    legalName?: boolean
    rejectionReason?: boolean
  }

  export type IntegrationRequestOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "clientName" | "hostingType" | "fixedIp" | "database" | "scopes" | "objective" | "technicalContact" | "responsiblePerson" | "status" | "createdAt" | "updatedAt" | "modules" | "cnpj" | "legalName" | "rejectionReason", ExtArgs["result"]["integrationRequest"]>

  export type $IntegrationRequestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "IntegrationRequest"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      clientName: string
      hostingType: $Enums.HostingType
      fixedIp: string | null
      database: Prisma.JsonValue
      scopes: Prisma.JsonValue
      objective: string
      technicalContact: Prisma.JsonValue
      responsiblePerson: Prisma.JsonValue
      status: string
      createdAt: Date
      updatedAt: Date
      modules: string[]
      cnpj: string | null
      legalName: string
      rejectionReason: string | null
    }, ExtArgs["result"]["integrationRequest"]>
    composites: {}
  }

  type IntegrationRequestGetPayload<S extends boolean | null | undefined | IntegrationRequestDefaultArgs> = $Result.GetResult<Prisma.$IntegrationRequestPayload, S>

  type IntegrationRequestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<IntegrationRequestFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: IntegrationRequestCountAggregateInputType | true
    }

  export interface IntegrationRequestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['IntegrationRequest'], meta: { name: 'IntegrationRequest' } }
    /**
     * Find zero or one IntegrationRequest that matches the filter.
     * @param {IntegrationRequestFindUniqueArgs} args - Arguments to find a IntegrationRequest
     * @example
     * // Get one IntegrationRequest
     * const integrationRequest = await prisma.integrationRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends IntegrationRequestFindUniqueArgs>(args: SelectSubset<T, IntegrationRequestFindUniqueArgs<ExtArgs>>): Prisma__IntegrationRequestClient<$Result.GetResult<Prisma.$IntegrationRequestPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one IntegrationRequest that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {IntegrationRequestFindUniqueOrThrowArgs} args - Arguments to find a IntegrationRequest
     * @example
     * // Get one IntegrationRequest
     * const integrationRequest = await prisma.integrationRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends IntegrationRequestFindUniqueOrThrowArgs>(args: SelectSubset<T, IntegrationRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__IntegrationRequestClient<$Result.GetResult<Prisma.$IntegrationRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first IntegrationRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IntegrationRequestFindFirstArgs} args - Arguments to find a IntegrationRequest
     * @example
     * // Get one IntegrationRequest
     * const integrationRequest = await prisma.integrationRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends IntegrationRequestFindFirstArgs>(args?: SelectSubset<T, IntegrationRequestFindFirstArgs<ExtArgs>>): Prisma__IntegrationRequestClient<$Result.GetResult<Prisma.$IntegrationRequestPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first IntegrationRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IntegrationRequestFindFirstOrThrowArgs} args - Arguments to find a IntegrationRequest
     * @example
     * // Get one IntegrationRequest
     * const integrationRequest = await prisma.integrationRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends IntegrationRequestFindFirstOrThrowArgs>(args?: SelectSubset<T, IntegrationRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma__IntegrationRequestClient<$Result.GetResult<Prisma.$IntegrationRequestPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more IntegrationRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IntegrationRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all IntegrationRequests
     * const integrationRequests = await prisma.integrationRequest.findMany()
     * 
     * // Get first 10 IntegrationRequests
     * const integrationRequests = await prisma.integrationRequest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const integrationRequestWithIdOnly = await prisma.integrationRequest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends IntegrationRequestFindManyArgs>(args?: SelectSubset<T, IntegrationRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IntegrationRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a IntegrationRequest.
     * @param {IntegrationRequestCreateArgs} args - Arguments to create a IntegrationRequest.
     * @example
     * // Create one IntegrationRequest
     * const IntegrationRequest = await prisma.integrationRequest.create({
     *   data: {
     *     // ... data to create a IntegrationRequest
     *   }
     * })
     * 
     */
    create<T extends IntegrationRequestCreateArgs>(args: SelectSubset<T, IntegrationRequestCreateArgs<ExtArgs>>): Prisma__IntegrationRequestClient<$Result.GetResult<Prisma.$IntegrationRequestPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many IntegrationRequests.
     * @param {IntegrationRequestCreateManyArgs} args - Arguments to create many IntegrationRequests.
     * @example
     * // Create many IntegrationRequests
     * const integrationRequest = await prisma.integrationRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends IntegrationRequestCreateManyArgs>(args?: SelectSubset<T, IntegrationRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many IntegrationRequests and returns the data saved in the database.
     * @param {IntegrationRequestCreateManyAndReturnArgs} args - Arguments to create many IntegrationRequests.
     * @example
     * // Create many IntegrationRequests
     * const integrationRequest = await prisma.integrationRequest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many IntegrationRequests and only return the `id`
     * const integrationRequestWithIdOnly = await prisma.integrationRequest.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends IntegrationRequestCreateManyAndReturnArgs>(args?: SelectSubset<T, IntegrationRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IntegrationRequestPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a IntegrationRequest.
     * @param {IntegrationRequestDeleteArgs} args - Arguments to delete one IntegrationRequest.
     * @example
     * // Delete one IntegrationRequest
     * const IntegrationRequest = await prisma.integrationRequest.delete({
     *   where: {
     *     // ... filter to delete one IntegrationRequest
     *   }
     * })
     * 
     */
    delete<T extends IntegrationRequestDeleteArgs>(args: SelectSubset<T, IntegrationRequestDeleteArgs<ExtArgs>>): Prisma__IntegrationRequestClient<$Result.GetResult<Prisma.$IntegrationRequestPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one IntegrationRequest.
     * @param {IntegrationRequestUpdateArgs} args - Arguments to update one IntegrationRequest.
     * @example
     * // Update one IntegrationRequest
     * const integrationRequest = await prisma.integrationRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends IntegrationRequestUpdateArgs>(args: SelectSubset<T, IntegrationRequestUpdateArgs<ExtArgs>>): Prisma__IntegrationRequestClient<$Result.GetResult<Prisma.$IntegrationRequestPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more IntegrationRequests.
     * @param {IntegrationRequestDeleteManyArgs} args - Arguments to filter IntegrationRequests to delete.
     * @example
     * // Delete a few IntegrationRequests
     * const { count } = await prisma.integrationRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends IntegrationRequestDeleteManyArgs>(args?: SelectSubset<T, IntegrationRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more IntegrationRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IntegrationRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many IntegrationRequests
     * const integrationRequest = await prisma.integrationRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends IntegrationRequestUpdateManyArgs>(args: SelectSubset<T, IntegrationRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more IntegrationRequests and returns the data updated in the database.
     * @param {IntegrationRequestUpdateManyAndReturnArgs} args - Arguments to update many IntegrationRequests.
     * @example
     * // Update many IntegrationRequests
     * const integrationRequest = await prisma.integrationRequest.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more IntegrationRequests and only return the `id`
     * const integrationRequestWithIdOnly = await prisma.integrationRequest.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends IntegrationRequestUpdateManyAndReturnArgs>(args: SelectSubset<T, IntegrationRequestUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IntegrationRequestPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one IntegrationRequest.
     * @param {IntegrationRequestUpsertArgs} args - Arguments to update or create a IntegrationRequest.
     * @example
     * // Update or create a IntegrationRequest
     * const integrationRequest = await prisma.integrationRequest.upsert({
     *   create: {
     *     // ... data to create a IntegrationRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the IntegrationRequest we want to update
     *   }
     * })
     */
    upsert<T extends IntegrationRequestUpsertArgs>(args: SelectSubset<T, IntegrationRequestUpsertArgs<ExtArgs>>): Prisma__IntegrationRequestClient<$Result.GetResult<Prisma.$IntegrationRequestPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of IntegrationRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IntegrationRequestCountArgs} args - Arguments to filter IntegrationRequests to count.
     * @example
     * // Count the number of IntegrationRequests
     * const count = await prisma.integrationRequest.count({
     *   where: {
     *     // ... the filter for the IntegrationRequests we want to count
     *   }
     * })
    **/
    count<T extends IntegrationRequestCountArgs>(
      args?: Subset<T, IntegrationRequestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], IntegrationRequestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a IntegrationRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IntegrationRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends IntegrationRequestAggregateArgs>(args: Subset<T, IntegrationRequestAggregateArgs>): Prisma.PrismaPromise<GetIntegrationRequestAggregateType<T>>

    /**
     * Group by IntegrationRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IntegrationRequestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends IntegrationRequestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: IntegrationRequestGroupByArgs['orderBy'] }
        : { orderBy?: IntegrationRequestGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, IntegrationRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetIntegrationRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the IntegrationRequest model
   */
  readonly fields: IntegrationRequestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for IntegrationRequest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__IntegrationRequestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the IntegrationRequest model
   */
  interface IntegrationRequestFieldRefs {
    readonly id: FieldRef<"IntegrationRequest", 'String'>
    readonly clientName: FieldRef<"IntegrationRequest", 'String'>
    readonly hostingType: FieldRef<"IntegrationRequest", 'HostingType'>
    readonly fixedIp: FieldRef<"IntegrationRequest", 'String'>
    readonly database: FieldRef<"IntegrationRequest", 'Json'>
    readonly scopes: FieldRef<"IntegrationRequest", 'Json'>
    readonly objective: FieldRef<"IntegrationRequest", 'String'>
    readonly technicalContact: FieldRef<"IntegrationRequest", 'Json'>
    readonly responsiblePerson: FieldRef<"IntegrationRequest", 'Json'>
    readonly status: FieldRef<"IntegrationRequest", 'String'>
    readonly createdAt: FieldRef<"IntegrationRequest", 'DateTime'>
    readonly updatedAt: FieldRef<"IntegrationRequest", 'DateTime'>
    readonly modules: FieldRef<"IntegrationRequest", 'String[]'>
    readonly cnpj: FieldRef<"IntegrationRequest", 'String'>
    readonly legalName: FieldRef<"IntegrationRequest", 'String'>
    readonly rejectionReason: FieldRef<"IntegrationRequest", 'String'>
  }
    

  // Custom InputTypes
  /**
   * IntegrationRequest findUnique
   */
  export type IntegrationRequestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrationRequest
     */
    select?: IntegrationRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IntegrationRequest
     */
    omit?: IntegrationRequestOmit<ExtArgs> | null
    /**
     * Filter, which IntegrationRequest to fetch.
     */
    where: IntegrationRequestWhereUniqueInput
  }

  /**
   * IntegrationRequest findUniqueOrThrow
   */
  export type IntegrationRequestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrationRequest
     */
    select?: IntegrationRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IntegrationRequest
     */
    omit?: IntegrationRequestOmit<ExtArgs> | null
    /**
     * Filter, which IntegrationRequest to fetch.
     */
    where: IntegrationRequestWhereUniqueInput
  }

  /**
   * IntegrationRequest findFirst
   */
  export type IntegrationRequestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrationRequest
     */
    select?: IntegrationRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IntegrationRequest
     */
    omit?: IntegrationRequestOmit<ExtArgs> | null
    /**
     * Filter, which IntegrationRequest to fetch.
     */
    where?: IntegrationRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IntegrationRequests to fetch.
     */
    orderBy?: IntegrationRequestOrderByWithRelationInput | IntegrationRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for IntegrationRequests.
     */
    cursor?: IntegrationRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IntegrationRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IntegrationRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of IntegrationRequests.
     */
    distinct?: IntegrationRequestScalarFieldEnum | IntegrationRequestScalarFieldEnum[]
  }

  /**
   * IntegrationRequest findFirstOrThrow
   */
  export type IntegrationRequestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrationRequest
     */
    select?: IntegrationRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IntegrationRequest
     */
    omit?: IntegrationRequestOmit<ExtArgs> | null
    /**
     * Filter, which IntegrationRequest to fetch.
     */
    where?: IntegrationRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IntegrationRequests to fetch.
     */
    orderBy?: IntegrationRequestOrderByWithRelationInput | IntegrationRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for IntegrationRequests.
     */
    cursor?: IntegrationRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IntegrationRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IntegrationRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of IntegrationRequests.
     */
    distinct?: IntegrationRequestScalarFieldEnum | IntegrationRequestScalarFieldEnum[]
  }

  /**
   * IntegrationRequest findMany
   */
  export type IntegrationRequestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrationRequest
     */
    select?: IntegrationRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IntegrationRequest
     */
    omit?: IntegrationRequestOmit<ExtArgs> | null
    /**
     * Filter, which IntegrationRequests to fetch.
     */
    where?: IntegrationRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IntegrationRequests to fetch.
     */
    orderBy?: IntegrationRequestOrderByWithRelationInput | IntegrationRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing IntegrationRequests.
     */
    cursor?: IntegrationRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IntegrationRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IntegrationRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of IntegrationRequests.
     */
    distinct?: IntegrationRequestScalarFieldEnum | IntegrationRequestScalarFieldEnum[]
  }

  /**
   * IntegrationRequest create
   */
  export type IntegrationRequestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrationRequest
     */
    select?: IntegrationRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IntegrationRequest
     */
    omit?: IntegrationRequestOmit<ExtArgs> | null
    /**
     * The data needed to create a IntegrationRequest.
     */
    data: XOR<IntegrationRequestCreateInput, IntegrationRequestUncheckedCreateInput>
  }

  /**
   * IntegrationRequest createMany
   */
  export type IntegrationRequestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many IntegrationRequests.
     */
    data: IntegrationRequestCreateManyInput | IntegrationRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * IntegrationRequest createManyAndReturn
   */
  export type IntegrationRequestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrationRequest
     */
    select?: IntegrationRequestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the IntegrationRequest
     */
    omit?: IntegrationRequestOmit<ExtArgs> | null
    /**
     * The data used to create many IntegrationRequests.
     */
    data: IntegrationRequestCreateManyInput | IntegrationRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * IntegrationRequest update
   */
  export type IntegrationRequestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrationRequest
     */
    select?: IntegrationRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IntegrationRequest
     */
    omit?: IntegrationRequestOmit<ExtArgs> | null
    /**
     * The data needed to update a IntegrationRequest.
     */
    data: XOR<IntegrationRequestUpdateInput, IntegrationRequestUncheckedUpdateInput>
    /**
     * Choose, which IntegrationRequest to update.
     */
    where: IntegrationRequestWhereUniqueInput
  }

  /**
   * IntegrationRequest updateMany
   */
  export type IntegrationRequestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update IntegrationRequests.
     */
    data: XOR<IntegrationRequestUpdateManyMutationInput, IntegrationRequestUncheckedUpdateManyInput>
    /**
     * Filter which IntegrationRequests to update
     */
    where?: IntegrationRequestWhereInput
    /**
     * Limit how many IntegrationRequests to update.
     */
    limit?: number
  }

  /**
   * IntegrationRequest updateManyAndReturn
   */
  export type IntegrationRequestUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrationRequest
     */
    select?: IntegrationRequestSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the IntegrationRequest
     */
    omit?: IntegrationRequestOmit<ExtArgs> | null
    /**
     * The data used to update IntegrationRequests.
     */
    data: XOR<IntegrationRequestUpdateManyMutationInput, IntegrationRequestUncheckedUpdateManyInput>
    /**
     * Filter which IntegrationRequests to update
     */
    where?: IntegrationRequestWhereInput
    /**
     * Limit how many IntegrationRequests to update.
     */
    limit?: number
  }

  /**
   * IntegrationRequest upsert
   */
  export type IntegrationRequestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrationRequest
     */
    select?: IntegrationRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IntegrationRequest
     */
    omit?: IntegrationRequestOmit<ExtArgs> | null
    /**
     * The filter to search for the IntegrationRequest to update in case it exists.
     */
    where: IntegrationRequestWhereUniqueInput
    /**
     * In case the IntegrationRequest found by the `where` argument doesn't exist, create a new IntegrationRequest with this data.
     */
    create: XOR<IntegrationRequestCreateInput, IntegrationRequestUncheckedCreateInput>
    /**
     * In case the IntegrationRequest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<IntegrationRequestUpdateInput, IntegrationRequestUncheckedUpdateInput>
  }

  /**
   * IntegrationRequest delete
   */
  export type IntegrationRequestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrationRequest
     */
    select?: IntegrationRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IntegrationRequest
     */
    omit?: IntegrationRequestOmit<ExtArgs> | null
    /**
     * Filter which IntegrationRequest to delete.
     */
    where: IntegrationRequestWhereUniqueInput
  }

  /**
   * IntegrationRequest deleteMany
   */
  export type IntegrationRequestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which IntegrationRequests to delete
     */
    where?: IntegrationRequestWhereInput
    /**
     * Limit how many IntegrationRequests to delete.
     */
    limit?: number
  }

  /**
   * IntegrationRequest without action
   */
  export type IntegrationRequestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrationRequest
     */
    select?: IntegrationRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IntegrationRequest
     */
    omit?: IntegrationRequestOmit<ExtArgs> | null
  }


  /**
   * Model Announcement
   */

  export type AggregateAnnouncement = {
    _count: AnnouncementCountAggregateOutputType | null
    _avg: AnnouncementAvgAggregateOutputType | null
    _sum: AnnouncementSumAggregateOutputType | null
    _min: AnnouncementMinAggregateOutputType | null
    _max: AnnouncementMaxAggregateOutputType | null
  }

  export type AnnouncementAvgAggregateOutputType = {
    newsletterId: number | null
  }

  export type AnnouncementSumAggregateOutputType = {
    newsletterId: number | null
  }

  export type AnnouncementMinAggregateOutputType = {
    id: string | null
    type: $Enums.AnnouncementType | null
    text: string | null
    ctaText: string | null
    ctaLink: string | null
    startDate: Date | null
    endDate: Date | null
    active: boolean | null
    newsletterId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AnnouncementMaxAggregateOutputType = {
    id: string | null
    type: $Enums.AnnouncementType | null
    text: string | null
    ctaText: string | null
    ctaLink: string | null
    startDate: Date | null
    endDate: Date | null
    active: boolean | null
    newsletterId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AnnouncementCountAggregateOutputType = {
    id: number
    type: number
    text: number
    ctaText: number
    ctaLink: number
    startDate: number
    endDate: number
    active: number
    newsletterId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AnnouncementAvgAggregateInputType = {
    newsletterId?: true
  }

  export type AnnouncementSumAggregateInputType = {
    newsletterId?: true
  }

  export type AnnouncementMinAggregateInputType = {
    id?: true
    type?: true
    text?: true
    ctaText?: true
    ctaLink?: true
    startDate?: true
    endDate?: true
    active?: true
    newsletterId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AnnouncementMaxAggregateInputType = {
    id?: true
    type?: true
    text?: true
    ctaText?: true
    ctaLink?: true
    startDate?: true
    endDate?: true
    active?: true
    newsletterId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AnnouncementCountAggregateInputType = {
    id?: true
    type?: true
    text?: true
    ctaText?: true
    ctaLink?: true
    startDate?: true
    endDate?: true
    active?: true
    newsletterId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AnnouncementAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Announcement to aggregate.
     */
    where?: AnnouncementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Announcements to fetch.
     */
    orderBy?: AnnouncementOrderByWithRelationInput | AnnouncementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AnnouncementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Announcements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Announcements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Announcements
    **/
    _count?: true | AnnouncementCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AnnouncementAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AnnouncementSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AnnouncementMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AnnouncementMaxAggregateInputType
  }

  export type GetAnnouncementAggregateType<T extends AnnouncementAggregateArgs> = {
        [P in keyof T & keyof AggregateAnnouncement]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAnnouncement[P]>
      : GetScalarType<T[P], AggregateAnnouncement[P]>
  }




  export type AnnouncementGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnnouncementWhereInput
    orderBy?: AnnouncementOrderByWithAggregationInput | AnnouncementOrderByWithAggregationInput[]
    by: AnnouncementScalarFieldEnum[] | AnnouncementScalarFieldEnum
    having?: AnnouncementScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AnnouncementCountAggregateInputType | true
    _avg?: AnnouncementAvgAggregateInputType
    _sum?: AnnouncementSumAggregateInputType
    _min?: AnnouncementMinAggregateInputType
    _max?: AnnouncementMaxAggregateInputType
  }

  export type AnnouncementGroupByOutputType = {
    id: string
    type: $Enums.AnnouncementType
    text: string
    ctaText: string | null
    ctaLink: string | null
    startDate: Date | null
    endDate: Date | null
    active: boolean
    newsletterId: number | null
    createdAt: Date
    updatedAt: Date
    _count: AnnouncementCountAggregateOutputType | null
    _avg: AnnouncementAvgAggregateOutputType | null
    _sum: AnnouncementSumAggregateOutputType | null
    _min: AnnouncementMinAggregateOutputType | null
    _max: AnnouncementMaxAggregateOutputType | null
  }

  type GetAnnouncementGroupByPayload<T extends AnnouncementGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AnnouncementGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AnnouncementGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AnnouncementGroupByOutputType[P]>
            : GetScalarType<T[P], AnnouncementGroupByOutputType[P]>
        }
      >
    >


  export type AnnouncementSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    text?: boolean
    ctaText?: boolean
    ctaLink?: boolean
    startDate?: boolean
    endDate?: boolean
    active?: boolean
    newsletterId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    views?: boolean | Announcement$viewsArgs<ExtArgs>
    newsletter?: boolean | Announcement$newsletterArgs<ExtArgs>
    _count?: boolean | AnnouncementCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["announcement"]>

  export type AnnouncementSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    text?: boolean
    ctaText?: boolean
    ctaLink?: boolean
    startDate?: boolean
    endDate?: boolean
    active?: boolean
    newsletterId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    newsletter?: boolean | Announcement$newsletterArgs<ExtArgs>
  }, ExtArgs["result"]["announcement"]>

  export type AnnouncementSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    text?: boolean
    ctaText?: boolean
    ctaLink?: boolean
    startDate?: boolean
    endDate?: boolean
    active?: boolean
    newsletterId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    newsletter?: boolean | Announcement$newsletterArgs<ExtArgs>
  }, ExtArgs["result"]["announcement"]>

  export type AnnouncementSelectScalar = {
    id?: boolean
    type?: boolean
    text?: boolean
    ctaText?: boolean
    ctaLink?: boolean
    startDate?: boolean
    endDate?: boolean
    active?: boolean
    newsletterId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AnnouncementOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "type" | "text" | "ctaText" | "ctaLink" | "startDate" | "endDate" | "active" | "newsletterId" | "createdAt" | "updatedAt", ExtArgs["result"]["announcement"]>
  export type AnnouncementInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    views?: boolean | Announcement$viewsArgs<ExtArgs>
    newsletter?: boolean | Announcement$newsletterArgs<ExtArgs>
    _count?: boolean | AnnouncementCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AnnouncementIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    newsletter?: boolean | Announcement$newsletterArgs<ExtArgs>
  }
  export type AnnouncementIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    newsletter?: boolean | Announcement$newsletterArgs<ExtArgs>
  }

  export type $AnnouncementPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Announcement"
    objects: {
      views: Prisma.$AnnouncementViewPayload<ExtArgs>[]
      newsletter: Prisma.$NewsletterPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      type: $Enums.AnnouncementType
      text: string
      ctaText: string | null
      ctaLink: string | null
      startDate: Date | null
      endDate: Date | null
      active: boolean
      newsletterId: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["announcement"]>
    composites: {}
  }

  type AnnouncementGetPayload<S extends boolean | null | undefined | AnnouncementDefaultArgs> = $Result.GetResult<Prisma.$AnnouncementPayload, S>

  type AnnouncementCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AnnouncementFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AnnouncementCountAggregateInputType | true
    }

  export interface AnnouncementDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Announcement'], meta: { name: 'Announcement' } }
    /**
     * Find zero or one Announcement that matches the filter.
     * @param {AnnouncementFindUniqueArgs} args - Arguments to find a Announcement
     * @example
     * // Get one Announcement
     * const announcement = await prisma.announcement.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AnnouncementFindUniqueArgs>(args: SelectSubset<T, AnnouncementFindUniqueArgs<ExtArgs>>): Prisma__AnnouncementClient<$Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Announcement that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AnnouncementFindUniqueOrThrowArgs} args - Arguments to find a Announcement
     * @example
     * // Get one Announcement
     * const announcement = await prisma.announcement.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AnnouncementFindUniqueOrThrowArgs>(args: SelectSubset<T, AnnouncementFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AnnouncementClient<$Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Announcement that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnnouncementFindFirstArgs} args - Arguments to find a Announcement
     * @example
     * // Get one Announcement
     * const announcement = await prisma.announcement.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AnnouncementFindFirstArgs>(args?: SelectSubset<T, AnnouncementFindFirstArgs<ExtArgs>>): Prisma__AnnouncementClient<$Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Announcement that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnnouncementFindFirstOrThrowArgs} args - Arguments to find a Announcement
     * @example
     * // Get one Announcement
     * const announcement = await prisma.announcement.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AnnouncementFindFirstOrThrowArgs>(args?: SelectSubset<T, AnnouncementFindFirstOrThrowArgs<ExtArgs>>): Prisma__AnnouncementClient<$Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Announcements that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnnouncementFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Announcements
     * const announcements = await prisma.announcement.findMany()
     * 
     * // Get first 10 Announcements
     * const announcements = await prisma.announcement.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const announcementWithIdOnly = await prisma.announcement.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AnnouncementFindManyArgs>(args?: SelectSubset<T, AnnouncementFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Announcement.
     * @param {AnnouncementCreateArgs} args - Arguments to create a Announcement.
     * @example
     * // Create one Announcement
     * const Announcement = await prisma.announcement.create({
     *   data: {
     *     // ... data to create a Announcement
     *   }
     * })
     * 
     */
    create<T extends AnnouncementCreateArgs>(args: SelectSubset<T, AnnouncementCreateArgs<ExtArgs>>): Prisma__AnnouncementClient<$Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Announcements.
     * @param {AnnouncementCreateManyArgs} args - Arguments to create many Announcements.
     * @example
     * // Create many Announcements
     * const announcement = await prisma.announcement.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AnnouncementCreateManyArgs>(args?: SelectSubset<T, AnnouncementCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Announcements and returns the data saved in the database.
     * @param {AnnouncementCreateManyAndReturnArgs} args - Arguments to create many Announcements.
     * @example
     * // Create many Announcements
     * const announcement = await prisma.announcement.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Announcements and only return the `id`
     * const announcementWithIdOnly = await prisma.announcement.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AnnouncementCreateManyAndReturnArgs>(args?: SelectSubset<T, AnnouncementCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Announcement.
     * @param {AnnouncementDeleteArgs} args - Arguments to delete one Announcement.
     * @example
     * // Delete one Announcement
     * const Announcement = await prisma.announcement.delete({
     *   where: {
     *     // ... filter to delete one Announcement
     *   }
     * })
     * 
     */
    delete<T extends AnnouncementDeleteArgs>(args: SelectSubset<T, AnnouncementDeleteArgs<ExtArgs>>): Prisma__AnnouncementClient<$Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Announcement.
     * @param {AnnouncementUpdateArgs} args - Arguments to update one Announcement.
     * @example
     * // Update one Announcement
     * const announcement = await prisma.announcement.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AnnouncementUpdateArgs>(args: SelectSubset<T, AnnouncementUpdateArgs<ExtArgs>>): Prisma__AnnouncementClient<$Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Announcements.
     * @param {AnnouncementDeleteManyArgs} args - Arguments to filter Announcements to delete.
     * @example
     * // Delete a few Announcements
     * const { count } = await prisma.announcement.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AnnouncementDeleteManyArgs>(args?: SelectSubset<T, AnnouncementDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Announcements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnnouncementUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Announcements
     * const announcement = await prisma.announcement.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AnnouncementUpdateManyArgs>(args: SelectSubset<T, AnnouncementUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Announcements and returns the data updated in the database.
     * @param {AnnouncementUpdateManyAndReturnArgs} args - Arguments to update many Announcements.
     * @example
     * // Update many Announcements
     * const announcement = await prisma.announcement.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Announcements and only return the `id`
     * const announcementWithIdOnly = await prisma.announcement.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AnnouncementUpdateManyAndReturnArgs>(args: SelectSubset<T, AnnouncementUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Announcement.
     * @param {AnnouncementUpsertArgs} args - Arguments to update or create a Announcement.
     * @example
     * // Update or create a Announcement
     * const announcement = await prisma.announcement.upsert({
     *   create: {
     *     // ... data to create a Announcement
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Announcement we want to update
     *   }
     * })
     */
    upsert<T extends AnnouncementUpsertArgs>(args: SelectSubset<T, AnnouncementUpsertArgs<ExtArgs>>): Prisma__AnnouncementClient<$Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Announcements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnnouncementCountArgs} args - Arguments to filter Announcements to count.
     * @example
     * // Count the number of Announcements
     * const count = await prisma.announcement.count({
     *   where: {
     *     // ... the filter for the Announcements we want to count
     *   }
     * })
    **/
    count<T extends AnnouncementCountArgs>(
      args?: Subset<T, AnnouncementCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AnnouncementCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Announcement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnnouncementAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AnnouncementAggregateArgs>(args: Subset<T, AnnouncementAggregateArgs>): Prisma.PrismaPromise<GetAnnouncementAggregateType<T>>

    /**
     * Group by Announcement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnnouncementGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AnnouncementGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AnnouncementGroupByArgs['orderBy'] }
        : { orderBy?: AnnouncementGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AnnouncementGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAnnouncementGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Announcement model
   */
  readonly fields: AnnouncementFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Announcement.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AnnouncementClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    views<T extends Announcement$viewsArgs<ExtArgs> = {}>(args?: Subset<T, Announcement$viewsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnnouncementViewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    newsletter<T extends Announcement$newsletterArgs<ExtArgs> = {}>(args?: Subset<T, Announcement$newsletterArgs<ExtArgs>>): Prisma__NewsletterClient<$Result.GetResult<Prisma.$NewsletterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Announcement model
   */
  interface AnnouncementFieldRefs {
    readonly id: FieldRef<"Announcement", 'String'>
    readonly type: FieldRef<"Announcement", 'AnnouncementType'>
    readonly text: FieldRef<"Announcement", 'String'>
    readonly ctaText: FieldRef<"Announcement", 'String'>
    readonly ctaLink: FieldRef<"Announcement", 'String'>
    readonly startDate: FieldRef<"Announcement", 'DateTime'>
    readonly endDate: FieldRef<"Announcement", 'DateTime'>
    readonly active: FieldRef<"Announcement", 'Boolean'>
    readonly newsletterId: FieldRef<"Announcement", 'Int'>
    readonly createdAt: FieldRef<"Announcement", 'DateTime'>
    readonly updatedAt: FieldRef<"Announcement", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Announcement findUnique
   */
  export type AnnouncementFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Announcement
     */
    select?: AnnouncementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Announcement
     */
    omit?: AnnouncementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnnouncementInclude<ExtArgs> | null
    /**
     * Filter, which Announcement to fetch.
     */
    where: AnnouncementWhereUniqueInput
  }

  /**
   * Announcement findUniqueOrThrow
   */
  export type AnnouncementFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Announcement
     */
    select?: AnnouncementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Announcement
     */
    omit?: AnnouncementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnnouncementInclude<ExtArgs> | null
    /**
     * Filter, which Announcement to fetch.
     */
    where: AnnouncementWhereUniqueInput
  }

  /**
   * Announcement findFirst
   */
  export type AnnouncementFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Announcement
     */
    select?: AnnouncementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Announcement
     */
    omit?: AnnouncementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnnouncementInclude<ExtArgs> | null
    /**
     * Filter, which Announcement to fetch.
     */
    where?: AnnouncementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Announcements to fetch.
     */
    orderBy?: AnnouncementOrderByWithRelationInput | AnnouncementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Announcements.
     */
    cursor?: AnnouncementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Announcements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Announcements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Announcements.
     */
    distinct?: AnnouncementScalarFieldEnum | AnnouncementScalarFieldEnum[]
  }

  /**
   * Announcement findFirstOrThrow
   */
  export type AnnouncementFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Announcement
     */
    select?: AnnouncementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Announcement
     */
    omit?: AnnouncementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnnouncementInclude<ExtArgs> | null
    /**
     * Filter, which Announcement to fetch.
     */
    where?: AnnouncementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Announcements to fetch.
     */
    orderBy?: AnnouncementOrderByWithRelationInput | AnnouncementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Announcements.
     */
    cursor?: AnnouncementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Announcements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Announcements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Announcements.
     */
    distinct?: AnnouncementScalarFieldEnum | AnnouncementScalarFieldEnum[]
  }

  /**
   * Announcement findMany
   */
  export type AnnouncementFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Announcement
     */
    select?: AnnouncementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Announcement
     */
    omit?: AnnouncementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnnouncementInclude<ExtArgs> | null
    /**
     * Filter, which Announcements to fetch.
     */
    where?: AnnouncementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Announcements to fetch.
     */
    orderBy?: AnnouncementOrderByWithRelationInput | AnnouncementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Announcements.
     */
    cursor?: AnnouncementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Announcements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Announcements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Announcements.
     */
    distinct?: AnnouncementScalarFieldEnum | AnnouncementScalarFieldEnum[]
  }

  /**
   * Announcement create
   */
  export type AnnouncementCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Announcement
     */
    select?: AnnouncementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Announcement
     */
    omit?: AnnouncementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnnouncementInclude<ExtArgs> | null
    /**
     * The data needed to create a Announcement.
     */
    data: XOR<AnnouncementCreateInput, AnnouncementUncheckedCreateInput>
  }

  /**
   * Announcement createMany
   */
  export type AnnouncementCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Announcements.
     */
    data: AnnouncementCreateManyInput | AnnouncementCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Announcement createManyAndReturn
   */
  export type AnnouncementCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Announcement
     */
    select?: AnnouncementSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Announcement
     */
    omit?: AnnouncementOmit<ExtArgs> | null
    /**
     * The data used to create many Announcements.
     */
    data: AnnouncementCreateManyInput | AnnouncementCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnnouncementIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Announcement update
   */
  export type AnnouncementUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Announcement
     */
    select?: AnnouncementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Announcement
     */
    omit?: AnnouncementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnnouncementInclude<ExtArgs> | null
    /**
     * The data needed to update a Announcement.
     */
    data: XOR<AnnouncementUpdateInput, AnnouncementUncheckedUpdateInput>
    /**
     * Choose, which Announcement to update.
     */
    where: AnnouncementWhereUniqueInput
  }

  /**
   * Announcement updateMany
   */
  export type AnnouncementUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Announcements.
     */
    data: XOR<AnnouncementUpdateManyMutationInput, AnnouncementUncheckedUpdateManyInput>
    /**
     * Filter which Announcements to update
     */
    where?: AnnouncementWhereInput
    /**
     * Limit how many Announcements to update.
     */
    limit?: number
  }

  /**
   * Announcement updateManyAndReturn
   */
  export type AnnouncementUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Announcement
     */
    select?: AnnouncementSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Announcement
     */
    omit?: AnnouncementOmit<ExtArgs> | null
    /**
     * The data used to update Announcements.
     */
    data: XOR<AnnouncementUpdateManyMutationInput, AnnouncementUncheckedUpdateManyInput>
    /**
     * Filter which Announcements to update
     */
    where?: AnnouncementWhereInput
    /**
     * Limit how many Announcements to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnnouncementIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Announcement upsert
   */
  export type AnnouncementUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Announcement
     */
    select?: AnnouncementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Announcement
     */
    omit?: AnnouncementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnnouncementInclude<ExtArgs> | null
    /**
     * The filter to search for the Announcement to update in case it exists.
     */
    where: AnnouncementWhereUniqueInput
    /**
     * In case the Announcement found by the `where` argument doesn't exist, create a new Announcement with this data.
     */
    create: XOR<AnnouncementCreateInput, AnnouncementUncheckedCreateInput>
    /**
     * In case the Announcement was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AnnouncementUpdateInput, AnnouncementUncheckedUpdateInput>
  }

  /**
   * Announcement delete
   */
  export type AnnouncementDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Announcement
     */
    select?: AnnouncementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Announcement
     */
    omit?: AnnouncementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnnouncementInclude<ExtArgs> | null
    /**
     * Filter which Announcement to delete.
     */
    where: AnnouncementWhereUniqueInput
  }

  /**
   * Announcement deleteMany
   */
  export type AnnouncementDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Announcements to delete
     */
    where?: AnnouncementWhereInput
    /**
     * Limit how many Announcements to delete.
     */
    limit?: number
  }

  /**
   * Announcement.views
   */
  export type Announcement$viewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnnouncementView
     */
    select?: AnnouncementViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnnouncementView
     */
    omit?: AnnouncementViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnnouncementViewInclude<ExtArgs> | null
    where?: AnnouncementViewWhereInput
    orderBy?: AnnouncementViewOrderByWithRelationInput | AnnouncementViewOrderByWithRelationInput[]
    cursor?: AnnouncementViewWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AnnouncementViewScalarFieldEnum | AnnouncementViewScalarFieldEnum[]
  }

  /**
   * Announcement.newsletter
   */
  export type Announcement$newsletterArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Newsletter
     */
    select?: NewsletterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Newsletter
     */
    omit?: NewsletterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsletterInclude<ExtArgs> | null
    where?: NewsletterWhereInput
  }

  /**
   * Announcement without action
   */
  export type AnnouncementDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Announcement
     */
    select?: AnnouncementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Announcement
     */
    omit?: AnnouncementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnnouncementInclude<ExtArgs> | null
  }


  /**
   * Model Newsletter
   */

  export type AggregateNewsletter = {
    _count: NewsletterCountAggregateOutputType | null
    _avg: NewsletterAvgAggregateOutputType | null
    _sum: NewsletterSumAggregateOutputType | null
    _min: NewsletterMinAggregateOutputType | null
    _max: NewsletterMaxAggregateOutputType | null
  }

  export type NewsletterAvgAggregateOutputType = {
    id: number | null
  }

  export type NewsletterSumAggregateOutputType = {
    id: number | null
  }

  export type NewsletterMinAggregateOutputType = {
    id: number | null
    subject: string | null
    initialMessage: string | null
    finalMessage: string | null
    sentAt: Date | null
  }

  export type NewsletterMaxAggregateOutputType = {
    id: number | null
    subject: string | null
    initialMessage: string | null
    finalMessage: string | null
    sentAt: Date | null
  }

  export type NewsletterCountAggregateOutputType = {
    id: number
    subject: number
    initialMessage: number
    finalMessage: number
    sentAt: number
    _all: number
  }


  export type NewsletterAvgAggregateInputType = {
    id?: true
  }

  export type NewsletterSumAggregateInputType = {
    id?: true
  }

  export type NewsletterMinAggregateInputType = {
    id?: true
    subject?: true
    initialMessage?: true
    finalMessage?: true
    sentAt?: true
  }

  export type NewsletterMaxAggregateInputType = {
    id?: true
    subject?: true
    initialMessage?: true
    finalMessage?: true
    sentAt?: true
  }

  export type NewsletterCountAggregateInputType = {
    id?: true
    subject?: true
    initialMessage?: true
    finalMessage?: true
    sentAt?: true
    _all?: true
  }

  export type NewsletterAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Newsletter to aggregate.
     */
    where?: NewsletterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Newsletters to fetch.
     */
    orderBy?: NewsletterOrderByWithRelationInput | NewsletterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NewsletterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Newsletters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Newsletters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Newsletters
    **/
    _count?: true | NewsletterCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: NewsletterAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: NewsletterSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NewsletterMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NewsletterMaxAggregateInputType
  }

  export type GetNewsletterAggregateType<T extends NewsletterAggregateArgs> = {
        [P in keyof T & keyof AggregateNewsletter]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNewsletter[P]>
      : GetScalarType<T[P], AggregateNewsletter[P]>
  }




  export type NewsletterGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NewsletterWhereInput
    orderBy?: NewsletterOrderByWithAggregationInput | NewsletterOrderByWithAggregationInput[]
    by: NewsletterScalarFieldEnum[] | NewsletterScalarFieldEnum
    having?: NewsletterScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NewsletterCountAggregateInputType | true
    _avg?: NewsletterAvgAggregateInputType
    _sum?: NewsletterSumAggregateInputType
    _min?: NewsletterMinAggregateInputType
    _max?: NewsletterMaxAggregateInputType
  }

  export type NewsletterGroupByOutputType = {
    id: number
    subject: string
    initialMessage: string | null
    finalMessage: string | null
    sentAt: Date
    _count: NewsletterCountAggregateOutputType | null
    _avg: NewsletterAvgAggregateOutputType | null
    _sum: NewsletterSumAggregateOutputType | null
    _min: NewsletterMinAggregateOutputType | null
    _max: NewsletterMaxAggregateOutputType | null
  }

  type GetNewsletterGroupByPayload<T extends NewsletterGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NewsletterGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NewsletterGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NewsletterGroupByOutputType[P]>
            : GetScalarType<T[P], NewsletterGroupByOutputType[P]>
        }
      >
    >


  export type NewsletterSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    subject?: boolean
    initialMessage?: boolean
    finalMessage?: boolean
    sentAt?: boolean
    announcements?: boolean | Newsletter$announcementsArgs<ExtArgs>
    _count?: boolean | NewsletterCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["newsletter"]>

  export type NewsletterSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    subject?: boolean
    initialMessage?: boolean
    finalMessage?: boolean
    sentAt?: boolean
  }, ExtArgs["result"]["newsletter"]>

  export type NewsletterSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    subject?: boolean
    initialMessage?: boolean
    finalMessage?: boolean
    sentAt?: boolean
  }, ExtArgs["result"]["newsletter"]>

  export type NewsletterSelectScalar = {
    id?: boolean
    subject?: boolean
    initialMessage?: boolean
    finalMessage?: boolean
    sentAt?: boolean
  }

  export type NewsletterOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "subject" | "initialMessage" | "finalMessage" | "sentAt", ExtArgs["result"]["newsletter"]>
  export type NewsletterInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    announcements?: boolean | Newsletter$announcementsArgs<ExtArgs>
    _count?: boolean | NewsletterCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type NewsletterIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type NewsletterIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $NewsletterPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Newsletter"
    objects: {
      announcements: Prisma.$AnnouncementPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      subject: string
      initialMessage: string | null
      finalMessage: string | null
      sentAt: Date
    }, ExtArgs["result"]["newsletter"]>
    composites: {}
  }

  type NewsletterGetPayload<S extends boolean | null | undefined | NewsletterDefaultArgs> = $Result.GetResult<Prisma.$NewsletterPayload, S>

  type NewsletterCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NewsletterFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NewsletterCountAggregateInputType | true
    }

  export interface NewsletterDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Newsletter'], meta: { name: 'Newsletter' } }
    /**
     * Find zero or one Newsletter that matches the filter.
     * @param {NewsletterFindUniqueArgs} args - Arguments to find a Newsletter
     * @example
     * // Get one Newsletter
     * const newsletter = await prisma.newsletter.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NewsletterFindUniqueArgs>(args: SelectSubset<T, NewsletterFindUniqueArgs<ExtArgs>>): Prisma__NewsletterClient<$Result.GetResult<Prisma.$NewsletterPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Newsletter that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NewsletterFindUniqueOrThrowArgs} args - Arguments to find a Newsletter
     * @example
     * // Get one Newsletter
     * const newsletter = await prisma.newsletter.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NewsletterFindUniqueOrThrowArgs>(args: SelectSubset<T, NewsletterFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NewsletterClient<$Result.GetResult<Prisma.$NewsletterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Newsletter that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsletterFindFirstArgs} args - Arguments to find a Newsletter
     * @example
     * // Get one Newsletter
     * const newsletter = await prisma.newsletter.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NewsletterFindFirstArgs>(args?: SelectSubset<T, NewsletterFindFirstArgs<ExtArgs>>): Prisma__NewsletterClient<$Result.GetResult<Prisma.$NewsletterPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Newsletter that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsletterFindFirstOrThrowArgs} args - Arguments to find a Newsletter
     * @example
     * // Get one Newsletter
     * const newsletter = await prisma.newsletter.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NewsletterFindFirstOrThrowArgs>(args?: SelectSubset<T, NewsletterFindFirstOrThrowArgs<ExtArgs>>): Prisma__NewsletterClient<$Result.GetResult<Prisma.$NewsletterPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Newsletters that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsletterFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Newsletters
     * const newsletters = await prisma.newsletter.findMany()
     * 
     * // Get first 10 Newsletters
     * const newsletters = await prisma.newsletter.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const newsletterWithIdOnly = await prisma.newsletter.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NewsletterFindManyArgs>(args?: SelectSubset<T, NewsletterFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsletterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Newsletter.
     * @param {NewsletterCreateArgs} args - Arguments to create a Newsletter.
     * @example
     * // Create one Newsletter
     * const Newsletter = await prisma.newsletter.create({
     *   data: {
     *     // ... data to create a Newsletter
     *   }
     * })
     * 
     */
    create<T extends NewsletterCreateArgs>(args: SelectSubset<T, NewsletterCreateArgs<ExtArgs>>): Prisma__NewsletterClient<$Result.GetResult<Prisma.$NewsletterPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Newsletters.
     * @param {NewsletterCreateManyArgs} args - Arguments to create many Newsletters.
     * @example
     * // Create many Newsletters
     * const newsletter = await prisma.newsletter.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NewsletterCreateManyArgs>(args?: SelectSubset<T, NewsletterCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Newsletters and returns the data saved in the database.
     * @param {NewsletterCreateManyAndReturnArgs} args - Arguments to create many Newsletters.
     * @example
     * // Create many Newsletters
     * const newsletter = await prisma.newsletter.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Newsletters and only return the `id`
     * const newsletterWithIdOnly = await prisma.newsletter.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NewsletterCreateManyAndReturnArgs>(args?: SelectSubset<T, NewsletterCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsletterPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Newsletter.
     * @param {NewsletterDeleteArgs} args - Arguments to delete one Newsletter.
     * @example
     * // Delete one Newsletter
     * const Newsletter = await prisma.newsletter.delete({
     *   where: {
     *     // ... filter to delete one Newsletter
     *   }
     * })
     * 
     */
    delete<T extends NewsletterDeleteArgs>(args: SelectSubset<T, NewsletterDeleteArgs<ExtArgs>>): Prisma__NewsletterClient<$Result.GetResult<Prisma.$NewsletterPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Newsletter.
     * @param {NewsletterUpdateArgs} args - Arguments to update one Newsletter.
     * @example
     * // Update one Newsletter
     * const newsletter = await prisma.newsletter.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NewsletterUpdateArgs>(args: SelectSubset<T, NewsletterUpdateArgs<ExtArgs>>): Prisma__NewsletterClient<$Result.GetResult<Prisma.$NewsletterPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Newsletters.
     * @param {NewsletterDeleteManyArgs} args - Arguments to filter Newsletters to delete.
     * @example
     * // Delete a few Newsletters
     * const { count } = await prisma.newsletter.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NewsletterDeleteManyArgs>(args?: SelectSubset<T, NewsletterDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Newsletters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsletterUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Newsletters
     * const newsletter = await prisma.newsletter.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NewsletterUpdateManyArgs>(args: SelectSubset<T, NewsletterUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Newsletters and returns the data updated in the database.
     * @param {NewsletterUpdateManyAndReturnArgs} args - Arguments to update many Newsletters.
     * @example
     * // Update many Newsletters
     * const newsletter = await prisma.newsletter.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Newsletters and only return the `id`
     * const newsletterWithIdOnly = await prisma.newsletter.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends NewsletterUpdateManyAndReturnArgs>(args: SelectSubset<T, NewsletterUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsletterPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Newsletter.
     * @param {NewsletterUpsertArgs} args - Arguments to update or create a Newsletter.
     * @example
     * // Update or create a Newsletter
     * const newsletter = await prisma.newsletter.upsert({
     *   create: {
     *     // ... data to create a Newsletter
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Newsletter we want to update
     *   }
     * })
     */
    upsert<T extends NewsletterUpsertArgs>(args: SelectSubset<T, NewsletterUpsertArgs<ExtArgs>>): Prisma__NewsletterClient<$Result.GetResult<Prisma.$NewsletterPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Newsletters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsletterCountArgs} args - Arguments to filter Newsletters to count.
     * @example
     * // Count the number of Newsletters
     * const count = await prisma.newsletter.count({
     *   where: {
     *     // ... the filter for the Newsletters we want to count
     *   }
     * })
    **/
    count<T extends NewsletterCountArgs>(
      args?: Subset<T, NewsletterCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NewsletterCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Newsletter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsletterAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NewsletterAggregateArgs>(args: Subset<T, NewsletterAggregateArgs>): Prisma.PrismaPromise<GetNewsletterAggregateType<T>>

    /**
     * Group by Newsletter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsletterGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NewsletterGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NewsletterGroupByArgs['orderBy'] }
        : { orderBy?: NewsletterGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NewsletterGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNewsletterGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Newsletter model
   */
  readonly fields: NewsletterFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Newsletter.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NewsletterClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    announcements<T extends Newsletter$announcementsArgs<ExtArgs> = {}>(args?: Subset<T, Newsletter$announcementsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Newsletter model
   */
  interface NewsletterFieldRefs {
    readonly id: FieldRef<"Newsletter", 'Int'>
    readonly subject: FieldRef<"Newsletter", 'String'>
    readonly initialMessage: FieldRef<"Newsletter", 'String'>
    readonly finalMessage: FieldRef<"Newsletter", 'String'>
    readonly sentAt: FieldRef<"Newsletter", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Newsletter findUnique
   */
  export type NewsletterFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Newsletter
     */
    select?: NewsletterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Newsletter
     */
    omit?: NewsletterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsletterInclude<ExtArgs> | null
    /**
     * Filter, which Newsletter to fetch.
     */
    where: NewsletterWhereUniqueInput
  }

  /**
   * Newsletter findUniqueOrThrow
   */
  export type NewsletterFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Newsletter
     */
    select?: NewsletterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Newsletter
     */
    omit?: NewsletterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsletterInclude<ExtArgs> | null
    /**
     * Filter, which Newsletter to fetch.
     */
    where: NewsletterWhereUniqueInput
  }

  /**
   * Newsletter findFirst
   */
  export type NewsletterFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Newsletter
     */
    select?: NewsletterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Newsletter
     */
    omit?: NewsletterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsletterInclude<ExtArgs> | null
    /**
     * Filter, which Newsletter to fetch.
     */
    where?: NewsletterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Newsletters to fetch.
     */
    orderBy?: NewsletterOrderByWithRelationInput | NewsletterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Newsletters.
     */
    cursor?: NewsletterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Newsletters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Newsletters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Newsletters.
     */
    distinct?: NewsletterScalarFieldEnum | NewsletterScalarFieldEnum[]
  }

  /**
   * Newsletter findFirstOrThrow
   */
  export type NewsletterFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Newsletter
     */
    select?: NewsletterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Newsletter
     */
    omit?: NewsletterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsletterInclude<ExtArgs> | null
    /**
     * Filter, which Newsletter to fetch.
     */
    where?: NewsletterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Newsletters to fetch.
     */
    orderBy?: NewsletterOrderByWithRelationInput | NewsletterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Newsletters.
     */
    cursor?: NewsletterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Newsletters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Newsletters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Newsletters.
     */
    distinct?: NewsletterScalarFieldEnum | NewsletterScalarFieldEnum[]
  }

  /**
   * Newsletter findMany
   */
  export type NewsletterFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Newsletter
     */
    select?: NewsletterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Newsletter
     */
    omit?: NewsletterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsletterInclude<ExtArgs> | null
    /**
     * Filter, which Newsletters to fetch.
     */
    where?: NewsletterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Newsletters to fetch.
     */
    orderBy?: NewsletterOrderByWithRelationInput | NewsletterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Newsletters.
     */
    cursor?: NewsletterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Newsletters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Newsletters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Newsletters.
     */
    distinct?: NewsletterScalarFieldEnum | NewsletterScalarFieldEnum[]
  }

  /**
   * Newsletter create
   */
  export type NewsletterCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Newsletter
     */
    select?: NewsletterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Newsletter
     */
    omit?: NewsletterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsletterInclude<ExtArgs> | null
    /**
     * The data needed to create a Newsletter.
     */
    data: XOR<NewsletterCreateInput, NewsletterUncheckedCreateInput>
  }

  /**
   * Newsletter createMany
   */
  export type NewsletterCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Newsletters.
     */
    data: NewsletterCreateManyInput | NewsletterCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Newsletter createManyAndReturn
   */
  export type NewsletterCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Newsletter
     */
    select?: NewsletterSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Newsletter
     */
    omit?: NewsletterOmit<ExtArgs> | null
    /**
     * The data used to create many Newsletters.
     */
    data: NewsletterCreateManyInput | NewsletterCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Newsletter update
   */
  export type NewsletterUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Newsletter
     */
    select?: NewsletterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Newsletter
     */
    omit?: NewsletterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsletterInclude<ExtArgs> | null
    /**
     * The data needed to update a Newsletter.
     */
    data: XOR<NewsletterUpdateInput, NewsletterUncheckedUpdateInput>
    /**
     * Choose, which Newsletter to update.
     */
    where: NewsletterWhereUniqueInput
  }

  /**
   * Newsletter updateMany
   */
  export type NewsletterUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Newsletters.
     */
    data: XOR<NewsletterUpdateManyMutationInput, NewsletterUncheckedUpdateManyInput>
    /**
     * Filter which Newsletters to update
     */
    where?: NewsletterWhereInput
    /**
     * Limit how many Newsletters to update.
     */
    limit?: number
  }

  /**
   * Newsletter updateManyAndReturn
   */
  export type NewsletterUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Newsletter
     */
    select?: NewsletterSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Newsletter
     */
    omit?: NewsletterOmit<ExtArgs> | null
    /**
     * The data used to update Newsletters.
     */
    data: XOR<NewsletterUpdateManyMutationInput, NewsletterUncheckedUpdateManyInput>
    /**
     * Filter which Newsletters to update
     */
    where?: NewsletterWhereInput
    /**
     * Limit how many Newsletters to update.
     */
    limit?: number
  }

  /**
   * Newsletter upsert
   */
  export type NewsletterUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Newsletter
     */
    select?: NewsletterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Newsletter
     */
    omit?: NewsletterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsletterInclude<ExtArgs> | null
    /**
     * The filter to search for the Newsletter to update in case it exists.
     */
    where: NewsletterWhereUniqueInput
    /**
     * In case the Newsletter found by the `where` argument doesn't exist, create a new Newsletter with this data.
     */
    create: XOR<NewsletterCreateInput, NewsletterUncheckedCreateInput>
    /**
     * In case the Newsletter was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NewsletterUpdateInput, NewsletterUncheckedUpdateInput>
  }

  /**
   * Newsletter delete
   */
  export type NewsletterDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Newsletter
     */
    select?: NewsletterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Newsletter
     */
    omit?: NewsletterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsletterInclude<ExtArgs> | null
    /**
     * Filter which Newsletter to delete.
     */
    where: NewsletterWhereUniqueInput
  }

  /**
   * Newsletter deleteMany
   */
  export type NewsletterDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Newsletters to delete
     */
    where?: NewsletterWhereInput
    /**
     * Limit how many Newsletters to delete.
     */
    limit?: number
  }

  /**
   * Newsletter.announcements
   */
  export type Newsletter$announcementsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Announcement
     */
    select?: AnnouncementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Announcement
     */
    omit?: AnnouncementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnnouncementInclude<ExtArgs> | null
    where?: AnnouncementWhereInput
    orderBy?: AnnouncementOrderByWithRelationInput | AnnouncementOrderByWithRelationInput[]
    cursor?: AnnouncementWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AnnouncementScalarFieldEnum | AnnouncementScalarFieldEnum[]
  }

  /**
   * Newsletter without action
   */
  export type NewsletterDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Newsletter
     */
    select?: NewsletterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Newsletter
     */
    omit?: NewsletterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsletterInclude<ExtArgs> | null
  }


  /**
   * Model AnnouncementView
   */

  export type AggregateAnnouncementView = {
    _count: AnnouncementViewCountAggregateOutputType | null
    _min: AnnouncementViewMinAggregateOutputType | null
    _max: AnnouncementViewMaxAggregateOutputType | null
  }

  export type AnnouncementViewMinAggregateOutputType = {
    id: string | null
    announcementId: string | null
    userId: string | null
    viewedAt: Date | null
  }

  export type AnnouncementViewMaxAggregateOutputType = {
    id: string | null
    announcementId: string | null
    userId: string | null
    viewedAt: Date | null
  }

  export type AnnouncementViewCountAggregateOutputType = {
    id: number
    announcementId: number
    userId: number
    viewedAt: number
    _all: number
  }


  export type AnnouncementViewMinAggregateInputType = {
    id?: true
    announcementId?: true
    userId?: true
    viewedAt?: true
  }

  export type AnnouncementViewMaxAggregateInputType = {
    id?: true
    announcementId?: true
    userId?: true
    viewedAt?: true
  }

  export type AnnouncementViewCountAggregateInputType = {
    id?: true
    announcementId?: true
    userId?: true
    viewedAt?: true
    _all?: true
  }

  export type AnnouncementViewAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AnnouncementView to aggregate.
     */
    where?: AnnouncementViewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnnouncementViews to fetch.
     */
    orderBy?: AnnouncementViewOrderByWithRelationInput | AnnouncementViewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AnnouncementViewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnnouncementViews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnnouncementViews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AnnouncementViews
    **/
    _count?: true | AnnouncementViewCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AnnouncementViewMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AnnouncementViewMaxAggregateInputType
  }

  export type GetAnnouncementViewAggregateType<T extends AnnouncementViewAggregateArgs> = {
        [P in keyof T & keyof AggregateAnnouncementView]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAnnouncementView[P]>
      : GetScalarType<T[P], AggregateAnnouncementView[P]>
  }




  export type AnnouncementViewGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnnouncementViewWhereInput
    orderBy?: AnnouncementViewOrderByWithAggregationInput | AnnouncementViewOrderByWithAggregationInput[]
    by: AnnouncementViewScalarFieldEnum[] | AnnouncementViewScalarFieldEnum
    having?: AnnouncementViewScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AnnouncementViewCountAggregateInputType | true
    _min?: AnnouncementViewMinAggregateInputType
    _max?: AnnouncementViewMaxAggregateInputType
  }

  export type AnnouncementViewGroupByOutputType = {
    id: string
    announcementId: string
    userId: string
    viewedAt: Date
    _count: AnnouncementViewCountAggregateOutputType | null
    _min: AnnouncementViewMinAggregateOutputType | null
    _max: AnnouncementViewMaxAggregateOutputType | null
  }

  type GetAnnouncementViewGroupByPayload<T extends AnnouncementViewGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AnnouncementViewGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AnnouncementViewGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AnnouncementViewGroupByOutputType[P]>
            : GetScalarType<T[P], AnnouncementViewGroupByOutputType[P]>
        }
      >
    >


  export type AnnouncementViewSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    announcementId?: boolean
    userId?: boolean
    viewedAt?: boolean
    announcement?: boolean | AnnouncementDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["announcementView"]>

  export type AnnouncementViewSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    announcementId?: boolean
    userId?: boolean
    viewedAt?: boolean
    announcement?: boolean | AnnouncementDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["announcementView"]>

  export type AnnouncementViewSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    announcementId?: boolean
    userId?: boolean
    viewedAt?: boolean
    announcement?: boolean | AnnouncementDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["announcementView"]>

  export type AnnouncementViewSelectScalar = {
    id?: boolean
    announcementId?: boolean
    userId?: boolean
    viewedAt?: boolean
  }

  export type AnnouncementViewOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "announcementId" | "userId" | "viewedAt", ExtArgs["result"]["announcementView"]>
  export type AnnouncementViewInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    announcement?: boolean | AnnouncementDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AnnouncementViewIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    announcement?: boolean | AnnouncementDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AnnouncementViewIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    announcement?: boolean | AnnouncementDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AnnouncementViewPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AnnouncementView"
    objects: {
      announcement: Prisma.$AnnouncementPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      announcementId: string
      userId: string
      viewedAt: Date
    }, ExtArgs["result"]["announcementView"]>
    composites: {}
  }

  type AnnouncementViewGetPayload<S extends boolean | null | undefined | AnnouncementViewDefaultArgs> = $Result.GetResult<Prisma.$AnnouncementViewPayload, S>

  type AnnouncementViewCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AnnouncementViewFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AnnouncementViewCountAggregateInputType | true
    }

  export interface AnnouncementViewDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AnnouncementView'], meta: { name: 'AnnouncementView' } }
    /**
     * Find zero or one AnnouncementView that matches the filter.
     * @param {AnnouncementViewFindUniqueArgs} args - Arguments to find a AnnouncementView
     * @example
     * // Get one AnnouncementView
     * const announcementView = await prisma.announcementView.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AnnouncementViewFindUniqueArgs>(args: SelectSubset<T, AnnouncementViewFindUniqueArgs<ExtArgs>>): Prisma__AnnouncementViewClient<$Result.GetResult<Prisma.$AnnouncementViewPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AnnouncementView that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AnnouncementViewFindUniqueOrThrowArgs} args - Arguments to find a AnnouncementView
     * @example
     * // Get one AnnouncementView
     * const announcementView = await prisma.announcementView.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AnnouncementViewFindUniqueOrThrowArgs>(args: SelectSubset<T, AnnouncementViewFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AnnouncementViewClient<$Result.GetResult<Prisma.$AnnouncementViewPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AnnouncementView that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnnouncementViewFindFirstArgs} args - Arguments to find a AnnouncementView
     * @example
     * // Get one AnnouncementView
     * const announcementView = await prisma.announcementView.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AnnouncementViewFindFirstArgs>(args?: SelectSubset<T, AnnouncementViewFindFirstArgs<ExtArgs>>): Prisma__AnnouncementViewClient<$Result.GetResult<Prisma.$AnnouncementViewPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AnnouncementView that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnnouncementViewFindFirstOrThrowArgs} args - Arguments to find a AnnouncementView
     * @example
     * // Get one AnnouncementView
     * const announcementView = await prisma.announcementView.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AnnouncementViewFindFirstOrThrowArgs>(args?: SelectSubset<T, AnnouncementViewFindFirstOrThrowArgs<ExtArgs>>): Prisma__AnnouncementViewClient<$Result.GetResult<Prisma.$AnnouncementViewPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AnnouncementViews that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnnouncementViewFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AnnouncementViews
     * const announcementViews = await prisma.announcementView.findMany()
     * 
     * // Get first 10 AnnouncementViews
     * const announcementViews = await prisma.announcementView.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const announcementViewWithIdOnly = await prisma.announcementView.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AnnouncementViewFindManyArgs>(args?: SelectSubset<T, AnnouncementViewFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnnouncementViewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AnnouncementView.
     * @param {AnnouncementViewCreateArgs} args - Arguments to create a AnnouncementView.
     * @example
     * // Create one AnnouncementView
     * const AnnouncementView = await prisma.announcementView.create({
     *   data: {
     *     // ... data to create a AnnouncementView
     *   }
     * })
     * 
     */
    create<T extends AnnouncementViewCreateArgs>(args: SelectSubset<T, AnnouncementViewCreateArgs<ExtArgs>>): Prisma__AnnouncementViewClient<$Result.GetResult<Prisma.$AnnouncementViewPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AnnouncementViews.
     * @param {AnnouncementViewCreateManyArgs} args - Arguments to create many AnnouncementViews.
     * @example
     * // Create many AnnouncementViews
     * const announcementView = await prisma.announcementView.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AnnouncementViewCreateManyArgs>(args?: SelectSubset<T, AnnouncementViewCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AnnouncementViews and returns the data saved in the database.
     * @param {AnnouncementViewCreateManyAndReturnArgs} args - Arguments to create many AnnouncementViews.
     * @example
     * // Create many AnnouncementViews
     * const announcementView = await prisma.announcementView.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AnnouncementViews and only return the `id`
     * const announcementViewWithIdOnly = await prisma.announcementView.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AnnouncementViewCreateManyAndReturnArgs>(args?: SelectSubset<T, AnnouncementViewCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnnouncementViewPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AnnouncementView.
     * @param {AnnouncementViewDeleteArgs} args - Arguments to delete one AnnouncementView.
     * @example
     * // Delete one AnnouncementView
     * const AnnouncementView = await prisma.announcementView.delete({
     *   where: {
     *     // ... filter to delete one AnnouncementView
     *   }
     * })
     * 
     */
    delete<T extends AnnouncementViewDeleteArgs>(args: SelectSubset<T, AnnouncementViewDeleteArgs<ExtArgs>>): Prisma__AnnouncementViewClient<$Result.GetResult<Prisma.$AnnouncementViewPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AnnouncementView.
     * @param {AnnouncementViewUpdateArgs} args - Arguments to update one AnnouncementView.
     * @example
     * // Update one AnnouncementView
     * const announcementView = await prisma.announcementView.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AnnouncementViewUpdateArgs>(args: SelectSubset<T, AnnouncementViewUpdateArgs<ExtArgs>>): Prisma__AnnouncementViewClient<$Result.GetResult<Prisma.$AnnouncementViewPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AnnouncementViews.
     * @param {AnnouncementViewDeleteManyArgs} args - Arguments to filter AnnouncementViews to delete.
     * @example
     * // Delete a few AnnouncementViews
     * const { count } = await prisma.announcementView.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AnnouncementViewDeleteManyArgs>(args?: SelectSubset<T, AnnouncementViewDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AnnouncementViews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnnouncementViewUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AnnouncementViews
     * const announcementView = await prisma.announcementView.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AnnouncementViewUpdateManyArgs>(args: SelectSubset<T, AnnouncementViewUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AnnouncementViews and returns the data updated in the database.
     * @param {AnnouncementViewUpdateManyAndReturnArgs} args - Arguments to update many AnnouncementViews.
     * @example
     * // Update many AnnouncementViews
     * const announcementView = await prisma.announcementView.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AnnouncementViews and only return the `id`
     * const announcementViewWithIdOnly = await prisma.announcementView.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AnnouncementViewUpdateManyAndReturnArgs>(args: SelectSubset<T, AnnouncementViewUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnnouncementViewPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AnnouncementView.
     * @param {AnnouncementViewUpsertArgs} args - Arguments to update or create a AnnouncementView.
     * @example
     * // Update or create a AnnouncementView
     * const announcementView = await prisma.announcementView.upsert({
     *   create: {
     *     // ... data to create a AnnouncementView
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AnnouncementView we want to update
     *   }
     * })
     */
    upsert<T extends AnnouncementViewUpsertArgs>(args: SelectSubset<T, AnnouncementViewUpsertArgs<ExtArgs>>): Prisma__AnnouncementViewClient<$Result.GetResult<Prisma.$AnnouncementViewPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AnnouncementViews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnnouncementViewCountArgs} args - Arguments to filter AnnouncementViews to count.
     * @example
     * // Count the number of AnnouncementViews
     * const count = await prisma.announcementView.count({
     *   where: {
     *     // ... the filter for the AnnouncementViews we want to count
     *   }
     * })
    **/
    count<T extends AnnouncementViewCountArgs>(
      args?: Subset<T, AnnouncementViewCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AnnouncementViewCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AnnouncementView.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnnouncementViewAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AnnouncementViewAggregateArgs>(args: Subset<T, AnnouncementViewAggregateArgs>): Prisma.PrismaPromise<GetAnnouncementViewAggregateType<T>>

    /**
     * Group by AnnouncementView.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnnouncementViewGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AnnouncementViewGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AnnouncementViewGroupByArgs['orderBy'] }
        : { orderBy?: AnnouncementViewGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AnnouncementViewGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAnnouncementViewGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AnnouncementView model
   */
  readonly fields: AnnouncementViewFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AnnouncementView.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AnnouncementViewClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    announcement<T extends AnnouncementDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AnnouncementDefaultArgs<ExtArgs>>): Prisma__AnnouncementClient<$Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AnnouncementView model
   */
  interface AnnouncementViewFieldRefs {
    readonly id: FieldRef<"AnnouncementView", 'String'>
    readonly announcementId: FieldRef<"AnnouncementView", 'String'>
    readonly userId: FieldRef<"AnnouncementView", 'String'>
    readonly viewedAt: FieldRef<"AnnouncementView", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AnnouncementView findUnique
   */
  export type AnnouncementViewFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnnouncementView
     */
    select?: AnnouncementViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnnouncementView
     */
    omit?: AnnouncementViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnnouncementViewInclude<ExtArgs> | null
    /**
     * Filter, which AnnouncementView to fetch.
     */
    where: AnnouncementViewWhereUniqueInput
  }

  /**
   * AnnouncementView findUniqueOrThrow
   */
  export type AnnouncementViewFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnnouncementView
     */
    select?: AnnouncementViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnnouncementView
     */
    omit?: AnnouncementViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnnouncementViewInclude<ExtArgs> | null
    /**
     * Filter, which AnnouncementView to fetch.
     */
    where: AnnouncementViewWhereUniqueInput
  }

  /**
   * AnnouncementView findFirst
   */
  export type AnnouncementViewFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnnouncementView
     */
    select?: AnnouncementViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnnouncementView
     */
    omit?: AnnouncementViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnnouncementViewInclude<ExtArgs> | null
    /**
     * Filter, which AnnouncementView to fetch.
     */
    where?: AnnouncementViewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnnouncementViews to fetch.
     */
    orderBy?: AnnouncementViewOrderByWithRelationInput | AnnouncementViewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AnnouncementViews.
     */
    cursor?: AnnouncementViewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnnouncementViews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnnouncementViews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AnnouncementViews.
     */
    distinct?: AnnouncementViewScalarFieldEnum | AnnouncementViewScalarFieldEnum[]
  }

  /**
   * AnnouncementView findFirstOrThrow
   */
  export type AnnouncementViewFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnnouncementView
     */
    select?: AnnouncementViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnnouncementView
     */
    omit?: AnnouncementViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnnouncementViewInclude<ExtArgs> | null
    /**
     * Filter, which AnnouncementView to fetch.
     */
    where?: AnnouncementViewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnnouncementViews to fetch.
     */
    orderBy?: AnnouncementViewOrderByWithRelationInput | AnnouncementViewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AnnouncementViews.
     */
    cursor?: AnnouncementViewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnnouncementViews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnnouncementViews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AnnouncementViews.
     */
    distinct?: AnnouncementViewScalarFieldEnum | AnnouncementViewScalarFieldEnum[]
  }

  /**
   * AnnouncementView findMany
   */
  export type AnnouncementViewFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnnouncementView
     */
    select?: AnnouncementViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnnouncementView
     */
    omit?: AnnouncementViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnnouncementViewInclude<ExtArgs> | null
    /**
     * Filter, which AnnouncementViews to fetch.
     */
    where?: AnnouncementViewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnnouncementViews to fetch.
     */
    orderBy?: AnnouncementViewOrderByWithRelationInput | AnnouncementViewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AnnouncementViews.
     */
    cursor?: AnnouncementViewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnnouncementViews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnnouncementViews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AnnouncementViews.
     */
    distinct?: AnnouncementViewScalarFieldEnum | AnnouncementViewScalarFieldEnum[]
  }

  /**
   * AnnouncementView create
   */
  export type AnnouncementViewCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnnouncementView
     */
    select?: AnnouncementViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnnouncementView
     */
    omit?: AnnouncementViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnnouncementViewInclude<ExtArgs> | null
    /**
     * The data needed to create a AnnouncementView.
     */
    data: XOR<AnnouncementViewCreateInput, AnnouncementViewUncheckedCreateInput>
  }

  /**
   * AnnouncementView createMany
   */
  export type AnnouncementViewCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AnnouncementViews.
     */
    data: AnnouncementViewCreateManyInput | AnnouncementViewCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AnnouncementView createManyAndReturn
   */
  export type AnnouncementViewCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnnouncementView
     */
    select?: AnnouncementViewSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AnnouncementView
     */
    omit?: AnnouncementViewOmit<ExtArgs> | null
    /**
     * The data used to create many AnnouncementViews.
     */
    data: AnnouncementViewCreateManyInput | AnnouncementViewCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnnouncementViewIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AnnouncementView update
   */
  export type AnnouncementViewUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnnouncementView
     */
    select?: AnnouncementViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnnouncementView
     */
    omit?: AnnouncementViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnnouncementViewInclude<ExtArgs> | null
    /**
     * The data needed to update a AnnouncementView.
     */
    data: XOR<AnnouncementViewUpdateInput, AnnouncementViewUncheckedUpdateInput>
    /**
     * Choose, which AnnouncementView to update.
     */
    where: AnnouncementViewWhereUniqueInput
  }

  /**
   * AnnouncementView updateMany
   */
  export type AnnouncementViewUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AnnouncementViews.
     */
    data: XOR<AnnouncementViewUpdateManyMutationInput, AnnouncementViewUncheckedUpdateManyInput>
    /**
     * Filter which AnnouncementViews to update
     */
    where?: AnnouncementViewWhereInput
    /**
     * Limit how many AnnouncementViews to update.
     */
    limit?: number
  }

  /**
   * AnnouncementView updateManyAndReturn
   */
  export type AnnouncementViewUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnnouncementView
     */
    select?: AnnouncementViewSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AnnouncementView
     */
    omit?: AnnouncementViewOmit<ExtArgs> | null
    /**
     * The data used to update AnnouncementViews.
     */
    data: XOR<AnnouncementViewUpdateManyMutationInput, AnnouncementViewUncheckedUpdateManyInput>
    /**
     * Filter which AnnouncementViews to update
     */
    where?: AnnouncementViewWhereInput
    /**
     * Limit how many AnnouncementViews to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnnouncementViewIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AnnouncementView upsert
   */
  export type AnnouncementViewUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnnouncementView
     */
    select?: AnnouncementViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnnouncementView
     */
    omit?: AnnouncementViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnnouncementViewInclude<ExtArgs> | null
    /**
     * The filter to search for the AnnouncementView to update in case it exists.
     */
    where: AnnouncementViewWhereUniqueInput
    /**
     * In case the AnnouncementView found by the `where` argument doesn't exist, create a new AnnouncementView with this data.
     */
    create: XOR<AnnouncementViewCreateInput, AnnouncementViewUncheckedCreateInput>
    /**
     * In case the AnnouncementView was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AnnouncementViewUpdateInput, AnnouncementViewUncheckedUpdateInput>
  }

  /**
   * AnnouncementView delete
   */
  export type AnnouncementViewDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnnouncementView
     */
    select?: AnnouncementViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnnouncementView
     */
    omit?: AnnouncementViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnnouncementViewInclude<ExtArgs> | null
    /**
     * Filter which AnnouncementView to delete.
     */
    where: AnnouncementViewWhereUniqueInput
  }

  /**
   * AnnouncementView deleteMany
   */
  export type AnnouncementViewDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AnnouncementViews to delete
     */
    where?: AnnouncementViewWhereInput
    /**
     * Limit how many AnnouncementViews to delete.
     */
    limit?: number
  }

  /**
   * AnnouncementView without action
   */
  export type AnnouncementViewDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnnouncementView
     */
    select?: AnnouncementViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnnouncementView
     */
    omit?: AnnouncementViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnnouncementViewInclude<ExtArgs> | null
  }


  /**
   * Model StatusLog
   */

  export type AggregateStatusLog = {
    _count: StatusLogCountAggregateOutputType | null
    _avg: StatusLogAvgAggregateOutputType | null
    _sum: StatusLogSumAggregateOutputType | null
    _min: StatusLogMinAggregateOutputType | null
    _max: StatusLogMaxAggregateOutputType | null
  }

  export type StatusLogAvgAggregateOutputType = {
    apiLatency: number | null
    dbLatency: number | null
  }

  export type StatusLogSumAggregateOutputType = {
    apiLatency: number | null
    dbLatency: number | null
  }

  export type StatusLogMinAggregateOutputType = {
    id: string | null
    apiStatus: string | null
    apiLatency: number | null
    dbStatus: string | null
    dbLatency: number | null
    timestamp: Date | null
  }

  export type StatusLogMaxAggregateOutputType = {
    id: string | null
    apiStatus: string | null
    apiLatency: number | null
    dbStatus: string | null
    dbLatency: number | null
    timestamp: Date | null
  }

  export type StatusLogCountAggregateOutputType = {
    id: number
    apiStatus: number
    apiLatency: number
    dbStatus: number
    dbLatency: number
    timestamp: number
    _all: number
  }


  export type StatusLogAvgAggregateInputType = {
    apiLatency?: true
    dbLatency?: true
  }

  export type StatusLogSumAggregateInputType = {
    apiLatency?: true
    dbLatency?: true
  }

  export type StatusLogMinAggregateInputType = {
    id?: true
    apiStatus?: true
    apiLatency?: true
    dbStatus?: true
    dbLatency?: true
    timestamp?: true
  }

  export type StatusLogMaxAggregateInputType = {
    id?: true
    apiStatus?: true
    apiLatency?: true
    dbStatus?: true
    dbLatency?: true
    timestamp?: true
  }

  export type StatusLogCountAggregateInputType = {
    id?: true
    apiStatus?: true
    apiLatency?: true
    dbStatus?: true
    dbLatency?: true
    timestamp?: true
    _all?: true
  }

  export type StatusLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StatusLog to aggregate.
     */
    where?: StatusLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StatusLogs to fetch.
     */
    orderBy?: StatusLogOrderByWithRelationInput | StatusLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StatusLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StatusLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StatusLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StatusLogs
    **/
    _count?: true | StatusLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StatusLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StatusLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StatusLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StatusLogMaxAggregateInputType
  }

  export type GetStatusLogAggregateType<T extends StatusLogAggregateArgs> = {
        [P in keyof T & keyof AggregateStatusLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStatusLog[P]>
      : GetScalarType<T[P], AggregateStatusLog[P]>
  }




  export type StatusLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StatusLogWhereInput
    orderBy?: StatusLogOrderByWithAggregationInput | StatusLogOrderByWithAggregationInput[]
    by: StatusLogScalarFieldEnum[] | StatusLogScalarFieldEnum
    having?: StatusLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StatusLogCountAggregateInputType | true
    _avg?: StatusLogAvgAggregateInputType
    _sum?: StatusLogSumAggregateInputType
    _min?: StatusLogMinAggregateInputType
    _max?: StatusLogMaxAggregateInputType
  }

  export type StatusLogGroupByOutputType = {
    id: string
    apiStatus: string
    apiLatency: number
    dbStatus: string
    dbLatency: number
    timestamp: Date
    _count: StatusLogCountAggregateOutputType | null
    _avg: StatusLogAvgAggregateOutputType | null
    _sum: StatusLogSumAggregateOutputType | null
    _min: StatusLogMinAggregateOutputType | null
    _max: StatusLogMaxAggregateOutputType | null
  }

  type GetStatusLogGroupByPayload<T extends StatusLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StatusLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StatusLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StatusLogGroupByOutputType[P]>
            : GetScalarType<T[P], StatusLogGroupByOutputType[P]>
        }
      >
    >


  export type StatusLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    apiStatus?: boolean
    apiLatency?: boolean
    dbStatus?: boolean
    dbLatency?: boolean
    timestamp?: boolean
  }, ExtArgs["result"]["statusLog"]>

  export type StatusLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    apiStatus?: boolean
    apiLatency?: boolean
    dbStatus?: boolean
    dbLatency?: boolean
    timestamp?: boolean
  }, ExtArgs["result"]["statusLog"]>

  export type StatusLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    apiStatus?: boolean
    apiLatency?: boolean
    dbStatus?: boolean
    dbLatency?: boolean
    timestamp?: boolean
  }, ExtArgs["result"]["statusLog"]>

  export type StatusLogSelectScalar = {
    id?: boolean
    apiStatus?: boolean
    apiLatency?: boolean
    dbStatus?: boolean
    dbLatency?: boolean
    timestamp?: boolean
  }

  export type StatusLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "apiStatus" | "apiLatency" | "dbStatus" | "dbLatency" | "timestamp", ExtArgs["result"]["statusLog"]>

  export type $StatusLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StatusLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      apiStatus: string
      apiLatency: number
      dbStatus: string
      dbLatency: number
      timestamp: Date
    }, ExtArgs["result"]["statusLog"]>
    composites: {}
  }

  type StatusLogGetPayload<S extends boolean | null | undefined | StatusLogDefaultArgs> = $Result.GetResult<Prisma.$StatusLogPayload, S>

  type StatusLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StatusLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StatusLogCountAggregateInputType | true
    }

  export interface StatusLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StatusLog'], meta: { name: 'StatusLog' } }
    /**
     * Find zero or one StatusLog that matches the filter.
     * @param {StatusLogFindUniqueArgs} args - Arguments to find a StatusLog
     * @example
     * // Get one StatusLog
     * const statusLog = await prisma.statusLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StatusLogFindUniqueArgs>(args: SelectSubset<T, StatusLogFindUniqueArgs<ExtArgs>>): Prisma__StatusLogClient<$Result.GetResult<Prisma.$StatusLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one StatusLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StatusLogFindUniqueOrThrowArgs} args - Arguments to find a StatusLog
     * @example
     * // Get one StatusLog
     * const statusLog = await prisma.statusLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StatusLogFindUniqueOrThrowArgs>(args: SelectSubset<T, StatusLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StatusLogClient<$Result.GetResult<Prisma.$StatusLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StatusLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StatusLogFindFirstArgs} args - Arguments to find a StatusLog
     * @example
     * // Get one StatusLog
     * const statusLog = await prisma.statusLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StatusLogFindFirstArgs>(args?: SelectSubset<T, StatusLogFindFirstArgs<ExtArgs>>): Prisma__StatusLogClient<$Result.GetResult<Prisma.$StatusLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StatusLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StatusLogFindFirstOrThrowArgs} args - Arguments to find a StatusLog
     * @example
     * // Get one StatusLog
     * const statusLog = await prisma.statusLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StatusLogFindFirstOrThrowArgs>(args?: SelectSubset<T, StatusLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__StatusLogClient<$Result.GetResult<Prisma.$StatusLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more StatusLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StatusLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StatusLogs
     * const statusLogs = await prisma.statusLog.findMany()
     * 
     * // Get first 10 StatusLogs
     * const statusLogs = await prisma.statusLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const statusLogWithIdOnly = await prisma.statusLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StatusLogFindManyArgs>(args?: SelectSubset<T, StatusLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StatusLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a StatusLog.
     * @param {StatusLogCreateArgs} args - Arguments to create a StatusLog.
     * @example
     * // Create one StatusLog
     * const StatusLog = await prisma.statusLog.create({
     *   data: {
     *     // ... data to create a StatusLog
     *   }
     * })
     * 
     */
    create<T extends StatusLogCreateArgs>(args: SelectSubset<T, StatusLogCreateArgs<ExtArgs>>): Prisma__StatusLogClient<$Result.GetResult<Prisma.$StatusLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many StatusLogs.
     * @param {StatusLogCreateManyArgs} args - Arguments to create many StatusLogs.
     * @example
     * // Create many StatusLogs
     * const statusLog = await prisma.statusLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StatusLogCreateManyArgs>(args?: SelectSubset<T, StatusLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many StatusLogs and returns the data saved in the database.
     * @param {StatusLogCreateManyAndReturnArgs} args - Arguments to create many StatusLogs.
     * @example
     * // Create many StatusLogs
     * const statusLog = await prisma.statusLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many StatusLogs and only return the `id`
     * const statusLogWithIdOnly = await prisma.statusLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StatusLogCreateManyAndReturnArgs>(args?: SelectSubset<T, StatusLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StatusLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a StatusLog.
     * @param {StatusLogDeleteArgs} args - Arguments to delete one StatusLog.
     * @example
     * // Delete one StatusLog
     * const StatusLog = await prisma.statusLog.delete({
     *   where: {
     *     // ... filter to delete one StatusLog
     *   }
     * })
     * 
     */
    delete<T extends StatusLogDeleteArgs>(args: SelectSubset<T, StatusLogDeleteArgs<ExtArgs>>): Prisma__StatusLogClient<$Result.GetResult<Prisma.$StatusLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one StatusLog.
     * @param {StatusLogUpdateArgs} args - Arguments to update one StatusLog.
     * @example
     * // Update one StatusLog
     * const statusLog = await prisma.statusLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StatusLogUpdateArgs>(args: SelectSubset<T, StatusLogUpdateArgs<ExtArgs>>): Prisma__StatusLogClient<$Result.GetResult<Prisma.$StatusLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more StatusLogs.
     * @param {StatusLogDeleteManyArgs} args - Arguments to filter StatusLogs to delete.
     * @example
     * // Delete a few StatusLogs
     * const { count } = await prisma.statusLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StatusLogDeleteManyArgs>(args?: SelectSubset<T, StatusLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StatusLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StatusLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StatusLogs
     * const statusLog = await prisma.statusLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StatusLogUpdateManyArgs>(args: SelectSubset<T, StatusLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StatusLogs and returns the data updated in the database.
     * @param {StatusLogUpdateManyAndReturnArgs} args - Arguments to update many StatusLogs.
     * @example
     * // Update many StatusLogs
     * const statusLog = await prisma.statusLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more StatusLogs and only return the `id`
     * const statusLogWithIdOnly = await prisma.statusLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends StatusLogUpdateManyAndReturnArgs>(args: SelectSubset<T, StatusLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StatusLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one StatusLog.
     * @param {StatusLogUpsertArgs} args - Arguments to update or create a StatusLog.
     * @example
     * // Update or create a StatusLog
     * const statusLog = await prisma.statusLog.upsert({
     *   create: {
     *     // ... data to create a StatusLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StatusLog we want to update
     *   }
     * })
     */
    upsert<T extends StatusLogUpsertArgs>(args: SelectSubset<T, StatusLogUpsertArgs<ExtArgs>>): Prisma__StatusLogClient<$Result.GetResult<Prisma.$StatusLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of StatusLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StatusLogCountArgs} args - Arguments to filter StatusLogs to count.
     * @example
     * // Count the number of StatusLogs
     * const count = await prisma.statusLog.count({
     *   where: {
     *     // ... the filter for the StatusLogs we want to count
     *   }
     * })
    **/
    count<T extends StatusLogCountArgs>(
      args?: Subset<T, StatusLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StatusLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StatusLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StatusLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StatusLogAggregateArgs>(args: Subset<T, StatusLogAggregateArgs>): Prisma.PrismaPromise<GetStatusLogAggregateType<T>>

    /**
     * Group by StatusLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StatusLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StatusLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StatusLogGroupByArgs['orderBy'] }
        : { orderBy?: StatusLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StatusLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStatusLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StatusLog model
   */
  readonly fields: StatusLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StatusLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StatusLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the StatusLog model
   */
  interface StatusLogFieldRefs {
    readonly id: FieldRef<"StatusLog", 'String'>
    readonly apiStatus: FieldRef<"StatusLog", 'String'>
    readonly apiLatency: FieldRef<"StatusLog", 'Int'>
    readonly dbStatus: FieldRef<"StatusLog", 'String'>
    readonly dbLatency: FieldRef<"StatusLog", 'Int'>
    readonly timestamp: FieldRef<"StatusLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * StatusLog findUnique
   */
  export type StatusLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatusLog
     */
    select?: StatusLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StatusLog
     */
    omit?: StatusLogOmit<ExtArgs> | null
    /**
     * Filter, which StatusLog to fetch.
     */
    where: StatusLogWhereUniqueInput
  }

  /**
   * StatusLog findUniqueOrThrow
   */
  export type StatusLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatusLog
     */
    select?: StatusLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StatusLog
     */
    omit?: StatusLogOmit<ExtArgs> | null
    /**
     * Filter, which StatusLog to fetch.
     */
    where: StatusLogWhereUniqueInput
  }

  /**
   * StatusLog findFirst
   */
  export type StatusLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatusLog
     */
    select?: StatusLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StatusLog
     */
    omit?: StatusLogOmit<ExtArgs> | null
    /**
     * Filter, which StatusLog to fetch.
     */
    where?: StatusLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StatusLogs to fetch.
     */
    orderBy?: StatusLogOrderByWithRelationInput | StatusLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StatusLogs.
     */
    cursor?: StatusLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StatusLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StatusLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StatusLogs.
     */
    distinct?: StatusLogScalarFieldEnum | StatusLogScalarFieldEnum[]
  }

  /**
   * StatusLog findFirstOrThrow
   */
  export type StatusLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatusLog
     */
    select?: StatusLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StatusLog
     */
    omit?: StatusLogOmit<ExtArgs> | null
    /**
     * Filter, which StatusLog to fetch.
     */
    where?: StatusLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StatusLogs to fetch.
     */
    orderBy?: StatusLogOrderByWithRelationInput | StatusLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StatusLogs.
     */
    cursor?: StatusLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StatusLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StatusLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StatusLogs.
     */
    distinct?: StatusLogScalarFieldEnum | StatusLogScalarFieldEnum[]
  }

  /**
   * StatusLog findMany
   */
  export type StatusLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatusLog
     */
    select?: StatusLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StatusLog
     */
    omit?: StatusLogOmit<ExtArgs> | null
    /**
     * Filter, which StatusLogs to fetch.
     */
    where?: StatusLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StatusLogs to fetch.
     */
    orderBy?: StatusLogOrderByWithRelationInput | StatusLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StatusLogs.
     */
    cursor?: StatusLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StatusLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StatusLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StatusLogs.
     */
    distinct?: StatusLogScalarFieldEnum | StatusLogScalarFieldEnum[]
  }

  /**
   * StatusLog create
   */
  export type StatusLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatusLog
     */
    select?: StatusLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StatusLog
     */
    omit?: StatusLogOmit<ExtArgs> | null
    /**
     * The data needed to create a StatusLog.
     */
    data: XOR<StatusLogCreateInput, StatusLogUncheckedCreateInput>
  }

  /**
   * StatusLog createMany
   */
  export type StatusLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StatusLogs.
     */
    data: StatusLogCreateManyInput | StatusLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StatusLog createManyAndReturn
   */
  export type StatusLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatusLog
     */
    select?: StatusLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StatusLog
     */
    omit?: StatusLogOmit<ExtArgs> | null
    /**
     * The data used to create many StatusLogs.
     */
    data: StatusLogCreateManyInput | StatusLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StatusLog update
   */
  export type StatusLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatusLog
     */
    select?: StatusLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StatusLog
     */
    omit?: StatusLogOmit<ExtArgs> | null
    /**
     * The data needed to update a StatusLog.
     */
    data: XOR<StatusLogUpdateInput, StatusLogUncheckedUpdateInput>
    /**
     * Choose, which StatusLog to update.
     */
    where: StatusLogWhereUniqueInput
  }

  /**
   * StatusLog updateMany
   */
  export type StatusLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StatusLogs.
     */
    data: XOR<StatusLogUpdateManyMutationInput, StatusLogUncheckedUpdateManyInput>
    /**
     * Filter which StatusLogs to update
     */
    where?: StatusLogWhereInput
    /**
     * Limit how many StatusLogs to update.
     */
    limit?: number
  }

  /**
   * StatusLog updateManyAndReturn
   */
  export type StatusLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatusLog
     */
    select?: StatusLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StatusLog
     */
    omit?: StatusLogOmit<ExtArgs> | null
    /**
     * The data used to update StatusLogs.
     */
    data: XOR<StatusLogUpdateManyMutationInput, StatusLogUncheckedUpdateManyInput>
    /**
     * Filter which StatusLogs to update
     */
    where?: StatusLogWhereInput
    /**
     * Limit how many StatusLogs to update.
     */
    limit?: number
  }

  /**
   * StatusLog upsert
   */
  export type StatusLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatusLog
     */
    select?: StatusLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StatusLog
     */
    omit?: StatusLogOmit<ExtArgs> | null
    /**
     * The filter to search for the StatusLog to update in case it exists.
     */
    where: StatusLogWhereUniqueInput
    /**
     * In case the StatusLog found by the `where` argument doesn't exist, create a new StatusLog with this data.
     */
    create: XOR<StatusLogCreateInput, StatusLogUncheckedCreateInput>
    /**
     * In case the StatusLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StatusLogUpdateInput, StatusLogUncheckedUpdateInput>
  }

  /**
   * StatusLog delete
   */
  export type StatusLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatusLog
     */
    select?: StatusLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StatusLog
     */
    omit?: StatusLogOmit<ExtArgs> | null
    /**
     * Filter which StatusLog to delete.
     */
    where: StatusLogWhereUniqueInput
  }

  /**
   * StatusLog deleteMany
   */
  export type StatusLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StatusLogs to delete
     */
    where?: StatusLogWhereInput
    /**
     * Limit how many StatusLogs to delete.
     */
    limit?: number
  }

  /**
   * StatusLog without action
   */
  export type StatusLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatusLog
     */
    select?: StatusLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StatusLog
     */
    omit?: StatusLogOmit<ExtArgs> | null
  }


  /**
   * Model SystemHeartbeat
   */

  export type AggregateSystemHeartbeat = {
    _count: SystemHeartbeatCountAggregateOutputType | null
    _min: SystemHeartbeatMinAggregateOutputType | null
    _max: SystemHeartbeatMaxAggregateOutputType | null
  }

  export type SystemHeartbeatMinAggregateOutputType = {
    id: string | null
    service: string | null
    timestamp: Date | null
  }

  export type SystemHeartbeatMaxAggregateOutputType = {
    id: string | null
    service: string | null
    timestamp: Date | null
  }

  export type SystemHeartbeatCountAggregateOutputType = {
    id: number
    service: number
    timestamp: number
    _all: number
  }


  export type SystemHeartbeatMinAggregateInputType = {
    id?: true
    service?: true
    timestamp?: true
  }

  export type SystemHeartbeatMaxAggregateInputType = {
    id?: true
    service?: true
    timestamp?: true
  }

  export type SystemHeartbeatCountAggregateInputType = {
    id?: true
    service?: true
    timestamp?: true
    _all?: true
  }

  export type SystemHeartbeatAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SystemHeartbeat to aggregate.
     */
    where?: SystemHeartbeatWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemHeartbeats to fetch.
     */
    orderBy?: SystemHeartbeatOrderByWithRelationInput | SystemHeartbeatOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SystemHeartbeatWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemHeartbeats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemHeartbeats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SystemHeartbeats
    **/
    _count?: true | SystemHeartbeatCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SystemHeartbeatMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SystemHeartbeatMaxAggregateInputType
  }

  export type GetSystemHeartbeatAggregateType<T extends SystemHeartbeatAggregateArgs> = {
        [P in keyof T & keyof AggregateSystemHeartbeat]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSystemHeartbeat[P]>
      : GetScalarType<T[P], AggregateSystemHeartbeat[P]>
  }




  export type SystemHeartbeatGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SystemHeartbeatWhereInput
    orderBy?: SystemHeartbeatOrderByWithAggregationInput | SystemHeartbeatOrderByWithAggregationInput[]
    by: SystemHeartbeatScalarFieldEnum[] | SystemHeartbeatScalarFieldEnum
    having?: SystemHeartbeatScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SystemHeartbeatCountAggregateInputType | true
    _min?: SystemHeartbeatMinAggregateInputType
    _max?: SystemHeartbeatMaxAggregateInputType
  }

  export type SystemHeartbeatGroupByOutputType = {
    id: string
    service: string
    timestamp: Date
    _count: SystemHeartbeatCountAggregateOutputType | null
    _min: SystemHeartbeatMinAggregateOutputType | null
    _max: SystemHeartbeatMaxAggregateOutputType | null
  }

  type GetSystemHeartbeatGroupByPayload<T extends SystemHeartbeatGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SystemHeartbeatGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SystemHeartbeatGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SystemHeartbeatGroupByOutputType[P]>
            : GetScalarType<T[P], SystemHeartbeatGroupByOutputType[P]>
        }
      >
    >


  export type SystemHeartbeatSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    service?: boolean
    timestamp?: boolean
  }, ExtArgs["result"]["systemHeartbeat"]>

  export type SystemHeartbeatSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    service?: boolean
    timestamp?: boolean
  }, ExtArgs["result"]["systemHeartbeat"]>

  export type SystemHeartbeatSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    service?: boolean
    timestamp?: boolean
  }, ExtArgs["result"]["systemHeartbeat"]>

  export type SystemHeartbeatSelectScalar = {
    id?: boolean
    service?: boolean
    timestamp?: boolean
  }

  export type SystemHeartbeatOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "service" | "timestamp", ExtArgs["result"]["systemHeartbeat"]>

  export type $SystemHeartbeatPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SystemHeartbeat"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      service: string
      timestamp: Date
    }, ExtArgs["result"]["systemHeartbeat"]>
    composites: {}
  }

  type SystemHeartbeatGetPayload<S extends boolean | null | undefined | SystemHeartbeatDefaultArgs> = $Result.GetResult<Prisma.$SystemHeartbeatPayload, S>

  type SystemHeartbeatCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SystemHeartbeatFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SystemHeartbeatCountAggregateInputType | true
    }

  export interface SystemHeartbeatDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SystemHeartbeat'], meta: { name: 'SystemHeartbeat' } }
    /**
     * Find zero or one SystemHeartbeat that matches the filter.
     * @param {SystemHeartbeatFindUniqueArgs} args - Arguments to find a SystemHeartbeat
     * @example
     * // Get one SystemHeartbeat
     * const systemHeartbeat = await prisma.systemHeartbeat.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SystemHeartbeatFindUniqueArgs>(args: SelectSubset<T, SystemHeartbeatFindUniqueArgs<ExtArgs>>): Prisma__SystemHeartbeatClient<$Result.GetResult<Prisma.$SystemHeartbeatPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SystemHeartbeat that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SystemHeartbeatFindUniqueOrThrowArgs} args - Arguments to find a SystemHeartbeat
     * @example
     * // Get one SystemHeartbeat
     * const systemHeartbeat = await prisma.systemHeartbeat.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SystemHeartbeatFindUniqueOrThrowArgs>(args: SelectSubset<T, SystemHeartbeatFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SystemHeartbeatClient<$Result.GetResult<Prisma.$SystemHeartbeatPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SystemHeartbeat that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemHeartbeatFindFirstArgs} args - Arguments to find a SystemHeartbeat
     * @example
     * // Get one SystemHeartbeat
     * const systemHeartbeat = await prisma.systemHeartbeat.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SystemHeartbeatFindFirstArgs>(args?: SelectSubset<T, SystemHeartbeatFindFirstArgs<ExtArgs>>): Prisma__SystemHeartbeatClient<$Result.GetResult<Prisma.$SystemHeartbeatPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SystemHeartbeat that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemHeartbeatFindFirstOrThrowArgs} args - Arguments to find a SystemHeartbeat
     * @example
     * // Get one SystemHeartbeat
     * const systemHeartbeat = await prisma.systemHeartbeat.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SystemHeartbeatFindFirstOrThrowArgs>(args?: SelectSubset<T, SystemHeartbeatFindFirstOrThrowArgs<ExtArgs>>): Prisma__SystemHeartbeatClient<$Result.GetResult<Prisma.$SystemHeartbeatPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SystemHeartbeats that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemHeartbeatFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SystemHeartbeats
     * const systemHeartbeats = await prisma.systemHeartbeat.findMany()
     * 
     * // Get first 10 SystemHeartbeats
     * const systemHeartbeats = await prisma.systemHeartbeat.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const systemHeartbeatWithIdOnly = await prisma.systemHeartbeat.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SystemHeartbeatFindManyArgs>(args?: SelectSubset<T, SystemHeartbeatFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemHeartbeatPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SystemHeartbeat.
     * @param {SystemHeartbeatCreateArgs} args - Arguments to create a SystemHeartbeat.
     * @example
     * // Create one SystemHeartbeat
     * const SystemHeartbeat = await prisma.systemHeartbeat.create({
     *   data: {
     *     // ... data to create a SystemHeartbeat
     *   }
     * })
     * 
     */
    create<T extends SystemHeartbeatCreateArgs>(args: SelectSubset<T, SystemHeartbeatCreateArgs<ExtArgs>>): Prisma__SystemHeartbeatClient<$Result.GetResult<Prisma.$SystemHeartbeatPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SystemHeartbeats.
     * @param {SystemHeartbeatCreateManyArgs} args - Arguments to create many SystemHeartbeats.
     * @example
     * // Create many SystemHeartbeats
     * const systemHeartbeat = await prisma.systemHeartbeat.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SystemHeartbeatCreateManyArgs>(args?: SelectSubset<T, SystemHeartbeatCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SystemHeartbeats and returns the data saved in the database.
     * @param {SystemHeartbeatCreateManyAndReturnArgs} args - Arguments to create many SystemHeartbeats.
     * @example
     * // Create many SystemHeartbeats
     * const systemHeartbeat = await prisma.systemHeartbeat.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SystemHeartbeats and only return the `id`
     * const systemHeartbeatWithIdOnly = await prisma.systemHeartbeat.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SystemHeartbeatCreateManyAndReturnArgs>(args?: SelectSubset<T, SystemHeartbeatCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemHeartbeatPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SystemHeartbeat.
     * @param {SystemHeartbeatDeleteArgs} args - Arguments to delete one SystemHeartbeat.
     * @example
     * // Delete one SystemHeartbeat
     * const SystemHeartbeat = await prisma.systemHeartbeat.delete({
     *   where: {
     *     // ... filter to delete one SystemHeartbeat
     *   }
     * })
     * 
     */
    delete<T extends SystemHeartbeatDeleteArgs>(args: SelectSubset<T, SystemHeartbeatDeleteArgs<ExtArgs>>): Prisma__SystemHeartbeatClient<$Result.GetResult<Prisma.$SystemHeartbeatPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SystemHeartbeat.
     * @param {SystemHeartbeatUpdateArgs} args - Arguments to update one SystemHeartbeat.
     * @example
     * // Update one SystemHeartbeat
     * const systemHeartbeat = await prisma.systemHeartbeat.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SystemHeartbeatUpdateArgs>(args: SelectSubset<T, SystemHeartbeatUpdateArgs<ExtArgs>>): Prisma__SystemHeartbeatClient<$Result.GetResult<Prisma.$SystemHeartbeatPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SystemHeartbeats.
     * @param {SystemHeartbeatDeleteManyArgs} args - Arguments to filter SystemHeartbeats to delete.
     * @example
     * // Delete a few SystemHeartbeats
     * const { count } = await prisma.systemHeartbeat.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SystemHeartbeatDeleteManyArgs>(args?: SelectSubset<T, SystemHeartbeatDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SystemHeartbeats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemHeartbeatUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SystemHeartbeats
     * const systemHeartbeat = await prisma.systemHeartbeat.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SystemHeartbeatUpdateManyArgs>(args: SelectSubset<T, SystemHeartbeatUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SystemHeartbeats and returns the data updated in the database.
     * @param {SystemHeartbeatUpdateManyAndReturnArgs} args - Arguments to update many SystemHeartbeats.
     * @example
     * // Update many SystemHeartbeats
     * const systemHeartbeat = await prisma.systemHeartbeat.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SystemHeartbeats and only return the `id`
     * const systemHeartbeatWithIdOnly = await prisma.systemHeartbeat.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SystemHeartbeatUpdateManyAndReturnArgs>(args: SelectSubset<T, SystemHeartbeatUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemHeartbeatPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SystemHeartbeat.
     * @param {SystemHeartbeatUpsertArgs} args - Arguments to update or create a SystemHeartbeat.
     * @example
     * // Update or create a SystemHeartbeat
     * const systemHeartbeat = await prisma.systemHeartbeat.upsert({
     *   create: {
     *     // ... data to create a SystemHeartbeat
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SystemHeartbeat we want to update
     *   }
     * })
     */
    upsert<T extends SystemHeartbeatUpsertArgs>(args: SelectSubset<T, SystemHeartbeatUpsertArgs<ExtArgs>>): Prisma__SystemHeartbeatClient<$Result.GetResult<Prisma.$SystemHeartbeatPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SystemHeartbeats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemHeartbeatCountArgs} args - Arguments to filter SystemHeartbeats to count.
     * @example
     * // Count the number of SystemHeartbeats
     * const count = await prisma.systemHeartbeat.count({
     *   where: {
     *     // ... the filter for the SystemHeartbeats we want to count
     *   }
     * })
    **/
    count<T extends SystemHeartbeatCountArgs>(
      args?: Subset<T, SystemHeartbeatCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SystemHeartbeatCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SystemHeartbeat.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemHeartbeatAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SystemHeartbeatAggregateArgs>(args: Subset<T, SystemHeartbeatAggregateArgs>): Prisma.PrismaPromise<GetSystemHeartbeatAggregateType<T>>

    /**
     * Group by SystemHeartbeat.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemHeartbeatGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SystemHeartbeatGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SystemHeartbeatGroupByArgs['orderBy'] }
        : { orderBy?: SystemHeartbeatGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SystemHeartbeatGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSystemHeartbeatGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SystemHeartbeat model
   */
  readonly fields: SystemHeartbeatFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SystemHeartbeat.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SystemHeartbeatClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SystemHeartbeat model
   */
  interface SystemHeartbeatFieldRefs {
    readonly id: FieldRef<"SystemHeartbeat", 'String'>
    readonly service: FieldRef<"SystemHeartbeat", 'String'>
    readonly timestamp: FieldRef<"SystemHeartbeat", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SystemHeartbeat findUnique
   */
  export type SystemHeartbeatFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemHeartbeat
     */
    select?: SystemHeartbeatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemHeartbeat
     */
    omit?: SystemHeartbeatOmit<ExtArgs> | null
    /**
     * Filter, which SystemHeartbeat to fetch.
     */
    where: SystemHeartbeatWhereUniqueInput
  }

  /**
   * SystemHeartbeat findUniqueOrThrow
   */
  export type SystemHeartbeatFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemHeartbeat
     */
    select?: SystemHeartbeatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemHeartbeat
     */
    omit?: SystemHeartbeatOmit<ExtArgs> | null
    /**
     * Filter, which SystemHeartbeat to fetch.
     */
    where: SystemHeartbeatWhereUniqueInput
  }

  /**
   * SystemHeartbeat findFirst
   */
  export type SystemHeartbeatFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemHeartbeat
     */
    select?: SystemHeartbeatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemHeartbeat
     */
    omit?: SystemHeartbeatOmit<ExtArgs> | null
    /**
     * Filter, which SystemHeartbeat to fetch.
     */
    where?: SystemHeartbeatWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemHeartbeats to fetch.
     */
    orderBy?: SystemHeartbeatOrderByWithRelationInput | SystemHeartbeatOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SystemHeartbeats.
     */
    cursor?: SystemHeartbeatWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemHeartbeats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemHeartbeats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SystemHeartbeats.
     */
    distinct?: SystemHeartbeatScalarFieldEnum | SystemHeartbeatScalarFieldEnum[]
  }

  /**
   * SystemHeartbeat findFirstOrThrow
   */
  export type SystemHeartbeatFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemHeartbeat
     */
    select?: SystemHeartbeatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemHeartbeat
     */
    omit?: SystemHeartbeatOmit<ExtArgs> | null
    /**
     * Filter, which SystemHeartbeat to fetch.
     */
    where?: SystemHeartbeatWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemHeartbeats to fetch.
     */
    orderBy?: SystemHeartbeatOrderByWithRelationInput | SystemHeartbeatOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SystemHeartbeats.
     */
    cursor?: SystemHeartbeatWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemHeartbeats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemHeartbeats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SystemHeartbeats.
     */
    distinct?: SystemHeartbeatScalarFieldEnum | SystemHeartbeatScalarFieldEnum[]
  }

  /**
   * SystemHeartbeat findMany
   */
  export type SystemHeartbeatFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemHeartbeat
     */
    select?: SystemHeartbeatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemHeartbeat
     */
    omit?: SystemHeartbeatOmit<ExtArgs> | null
    /**
     * Filter, which SystemHeartbeats to fetch.
     */
    where?: SystemHeartbeatWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemHeartbeats to fetch.
     */
    orderBy?: SystemHeartbeatOrderByWithRelationInput | SystemHeartbeatOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SystemHeartbeats.
     */
    cursor?: SystemHeartbeatWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemHeartbeats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemHeartbeats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SystemHeartbeats.
     */
    distinct?: SystemHeartbeatScalarFieldEnum | SystemHeartbeatScalarFieldEnum[]
  }

  /**
   * SystemHeartbeat create
   */
  export type SystemHeartbeatCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemHeartbeat
     */
    select?: SystemHeartbeatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemHeartbeat
     */
    omit?: SystemHeartbeatOmit<ExtArgs> | null
    /**
     * The data needed to create a SystemHeartbeat.
     */
    data: XOR<SystemHeartbeatCreateInput, SystemHeartbeatUncheckedCreateInput>
  }

  /**
   * SystemHeartbeat createMany
   */
  export type SystemHeartbeatCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SystemHeartbeats.
     */
    data: SystemHeartbeatCreateManyInput | SystemHeartbeatCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SystemHeartbeat createManyAndReturn
   */
  export type SystemHeartbeatCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemHeartbeat
     */
    select?: SystemHeartbeatSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SystemHeartbeat
     */
    omit?: SystemHeartbeatOmit<ExtArgs> | null
    /**
     * The data used to create many SystemHeartbeats.
     */
    data: SystemHeartbeatCreateManyInput | SystemHeartbeatCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SystemHeartbeat update
   */
  export type SystemHeartbeatUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemHeartbeat
     */
    select?: SystemHeartbeatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemHeartbeat
     */
    omit?: SystemHeartbeatOmit<ExtArgs> | null
    /**
     * The data needed to update a SystemHeartbeat.
     */
    data: XOR<SystemHeartbeatUpdateInput, SystemHeartbeatUncheckedUpdateInput>
    /**
     * Choose, which SystemHeartbeat to update.
     */
    where: SystemHeartbeatWhereUniqueInput
  }

  /**
   * SystemHeartbeat updateMany
   */
  export type SystemHeartbeatUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SystemHeartbeats.
     */
    data: XOR<SystemHeartbeatUpdateManyMutationInput, SystemHeartbeatUncheckedUpdateManyInput>
    /**
     * Filter which SystemHeartbeats to update
     */
    where?: SystemHeartbeatWhereInput
    /**
     * Limit how many SystemHeartbeats to update.
     */
    limit?: number
  }

  /**
   * SystemHeartbeat updateManyAndReturn
   */
  export type SystemHeartbeatUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemHeartbeat
     */
    select?: SystemHeartbeatSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SystemHeartbeat
     */
    omit?: SystemHeartbeatOmit<ExtArgs> | null
    /**
     * The data used to update SystemHeartbeats.
     */
    data: XOR<SystemHeartbeatUpdateManyMutationInput, SystemHeartbeatUncheckedUpdateManyInput>
    /**
     * Filter which SystemHeartbeats to update
     */
    where?: SystemHeartbeatWhereInput
    /**
     * Limit how many SystemHeartbeats to update.
     */
    limit?: number
  }

  /**
   * SystemHeartbeat upsert
   */
  export type SystemHeartbeatUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemHeartbeat
     */
    select?: SystemHeartbeatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemHeartbeat
     */
    omit?: SystemHeartbeatOmit<ExtArgs> | null
    /**
     * The filter to search for the SystemHeartbeat to update in case it exists.
     */
    where: SystemHeartbeatWhereUniqueInput
    /**
     * In case the SystemHeartbeat found by the `where` argument doesn't exist, create a new SystemHeartbeat with this data.
     */
    create: XOR<SystemHeartbeatCreateInput, SystemHeartbeatUncheckedCreateInput>
    /**
     * In case the SystemHeartbeat was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SystemHeartbeatUpdateInput, SystemHeartbeatUncheckedUpdateInput>
  }

  /**
   * SystemHeartbeat delete
   */
  export type SystemHeartbeatDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemHeartbeat
     */
    select?: SystemHeartbeatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemHeartbeat
     */
    omit?: SystemHeartbeatOmit<ExtArgs> | null
    /**
     * Filter which SystemHeartbeat to delete.
     */
    where: SystemHeartbeatWhereUniqueInput
  }

  /**
   * SystemHeartbeat deleteMany
   */
  export type SystemHeartbeatDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SystemHeartbeats to delete
     */
    where?: SystemHeartbeatWhereInput
    /**
     * Limit how many SystemHeartbeats to delete.
     */
    limit?: number
  }

  /**
   * SystemHeartbeat without action
   */
  export type SystemHeartbeatDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemHeartbeat
     */
    select?: SystemHeartbeatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemHeartbeat
     */
    omit?: SystemHeartbeatOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    user: 'user',
    passwordHash: 'passwordHash',
    status: 'status',
    dbCredentialsId: 'dbCredentialsId',
    email: 'email',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    storeId: 'storeId',
    roleId: 'roleId',
    planId: 'planId'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const PlanScalarFieldEnum: {
    id: 'id',
    name: 'name',
    reqMin: 'reqMin',
    reqMonth: 'reqMonth',
    maxPageSize: 'maxPageSize',
    maxDateRangeDays: 'maxDateRangeDays'
  };

  export type PlanScalarFieldEnum = (typeof PlanScalarFieldEnum)[keyof typeof PlanScalarFieldEnum]


  export const RequestLogScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    method: 'method',
    path: 'path',
    status: 'status',
    ip: 'ip',
    durationMs: 'durationMs',
    createdAt: 'createdAt'
  };

  export type RequestLogScalarFieldEnum = (typeof RequestLogScalarFieldEnum)[keyof typeof RequestLogScalarFieldEnum]


  export const UserInvitationScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    token: 'token',
    createdAt: 'createdAt',
    expiresAt: 'expiresAt',
    acceptedAt: 'acceptedAt'
  };

  export type UserInvitationScalarFieldEnum = (typeof UserInvitationScalarFieldEnum)[keyof typeof UserInvitationScalarFieldEnum]


  export const DbCredentialsScalarFieldEnum: {
    id: 'id',
    host: 'host',
    port: 'port',
    database: 'database',
    user: 'user',
    dbId: 'dbId'
  };

  export type DbCredentialsScalarFieldEnum = (typeof DbCredentialsScalarFieldEnum)[keyof typeof DbCredentialsScalarFieldEnum]


  export const RoleScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description'
  };

  export type RoleScalarFieldEnum = (typeof RoleScalarFieldEnum)[keyof typeof RoleScalarFieldEnum]


  export const PermissionScalarFieldEnum: {
    id: 'id',
    key: 'key',
    name: 'name',
    description: 'description'
  };

  export type PermissionScalarFieldEnum = (typeof PermissionScalarFieldEnum)[keyof typeof PermissionScalarFieldEnum]


  export const RolePermissionScalarFieldEnum: {
    roleId: 'roleId',
    permissionId: 'permissionId'
  };

  export type RolePermissionScalarFieldEnum = (typeof RolePermissionScalarFieldEnum)[keyof typeof RolePermissionScalarFieldEnum]


  export const IntegrationRequestScalarFieldEnum: {
    id: 'id',
    clientName: 'clientName',
    hostingType: 'hostingType',
    fixedIp: 'fixedIp',
    database: 'database',
    scopes: 'scopes',
    objective: 'objective',
    technicalContact: 'technicalContact',
    responsiblePerson: 'responsiblePerson',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    modules: 'modules',
    cnpj: 'cnpj',
    legalName: 'legalName',
    rejectionReason: 'rejectionReason'
  };

  export type IntegrationRequestScalarFieldEnum = (typeof IntegrationRequestScalarFieldEnum)[keyof typeof IntegrationRequestScalarFieldEnum]


  export const AnnouncementScalarFieldEnum: {
    id: 'id',
    type: 'type',
    text: 'text',
    ctaText: 'ctaText',
    ctaLink: 'ctaLink',
    startDate: 'startDate',
    endDate: 'endDate',
    active: 'active',
    newsletterId: 'newsletterId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AnnouncementScalarFieldEnum = (typeof AnnouncementScalarFieldEnum)[keyof typeof AnnouncementScalarFieldEnum]


  export const NewsletterScalarFieldEnum: {
    id: 'id',
    subject: 'subject',
    initialMessage: 'initialMessage',
    finalMessage: 'finalMessage',
    sentAt: 'sentAt'
  };

  export type NewsletterScalarFieldEnum = (typeof NewsletterScalarFieldEnum)[keyof typeof NewsletterScalarFieldEnum]


  export const AnnouncementViewScalarFieldEnum: {
    id: 'id',
    announcementId: 'announcementId',
    userId: 'userId',
    viewedAt: 'viewedAt'
  };

  export type AnnouncementViewScalarFieldEnum = (typeof AnnouncementViewScalarFieldEnum)[keyof typeof AnnouncementViewScalarFieldEnum]


  export const StatusLogScalarFieldEnum: {
    id: 'id',
    apiStatus: 'apiStatus',
    apiLatency: 'apiLatency',
    dbStatus: 'dbStatus',
    dbLatency: 'dbLatency',
    timestamp: 'timestamp'
  };

  export type StatusLogScalarFieldEnum = (typeof StatusLogScalarFieldEnum)[keyof typeof StatusLogScalarFieldEnum]


  export const SystemHeartbeatScalarFieldEnum: {
    id: 'id',
    service: 'service',
    timestamp: 'timestamp'
  };

  export type SystemHeartbeatScalarFieldEnum = (typeof SystemHeartbeatScalarFieldEnum)[keyof typeof SystemHeartbeatScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'HostingType'
   */
  export type EnumHostingTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'HostingType'>
    


  /**
   * Reference to a field of type 'HostingType[]'
   */
  export type ListEnumHostingTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'HostingType[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'AnnouncementType'
   */
  export type EnumAnnouncementTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AnnouncementType'>
    


  /**
   * Reference to a field of type 'AnnouncementType[]'
   */
  export type ListEnumAnnouncementTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AnnouncementType[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    user?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    status?: BoolFilter<"User"> | boolean
    dbCredentialsId?: StringFilter<"User"> | string
    email?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    storeId?: IntFilter<"User"> | number
    roleId?: StringNullableFilter<"User"> | string | null
    planId?: StringNullableFilter<"User"> | string | null
    dbCredentials?: XOR<DbCredentialsScalarRelationFilter, DbCredentialsWhereInput>
    role?: XOR<RoleNullableScalarRelationFilter, RoleWhereInput> | null
    plan?: XOR<PlanNullableScalarRelationFilter, PlanWhereInput> | null
    invitation?: XOR<UserInvitationNullableScalarRelationFilter, UserInvitationWhereInput> | null
    requestLogs?: RequestLogListRelationFilter
    announcementViews?: AnnouncementViewListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    user?: SortOrder
    passwordHash?: SortOrder
    status?: SortOrder
    dbCredentialsId?: SortOrder
    email?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    storeId?: SortOrder
    roleId?: SortOrderInput | SortOrder
    planId?: SortOrderInput | SortOrder
    dbCredentials?: DbCredentialsOrderByWithRelationInput
    role?: RoleOrderByWithRelationInput
    plan?: PlanOrderByWithRelationInput
    invitation?: UserInvitationOrderByWithRelationInput
    requestLogs?: RequestLogOrderByRelationAggregateInput
    announcementViews?: AnnouncementViewOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    user?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    passwordHash?: StringFilter<"User"> | string
    status?: BoolFilter<"User"> | boolean
    dbCredentialsId?: StringFilter<"User"> | string
    email?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    storeId?: IntFilter<"User"> | number
    roleId?: StringNullableFilter<"User"> | string | null
    planId?: StringNullableFilter<"User"> | string | null
    dbCredentials?: XOR<DbCredentialsScalarRelationFilter, DbCredentialsWhereInput>
    role?: XOR<RoleNullableScalarRelationFilter, RoleWhereInput> | null
    plan?: XOR<PlanNullableScalarRelationFilter, PlanWhereInput> | null
    invitation?: XOR<UserInvitationNullableScalarRelationFilter, UserInvitationWhereInput> | null
    requestLogs?: RequestLogListRelationFilter
    announcementViews?: AnnouncementViewListRelationFilter
  }, "id" | "user">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    user?: SortOrder
    passwordHash?: SortOrder
    status?: SortOrder
    dbCredentialsId?: SortOrder
    email?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    storeId?: SortOrder
    roleId?: SortOrderInput | SortOrder
    planId?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    user?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    status?: BoolWithAggregatesFilter<"User"> | boolean
    dbCredentialsId?: StringWithAggregatesFilter<"User"> | string
    email?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    storeId?: IntWithAggregatesFilter<"User"> | number
    roleId?: StringNullableWithAggregatesFilter<"User"> | string | null
    planId?: StringNullableWithAggregatesFilter<"User"> | string | null
  }

  export type PlanWhereInput = {
    AND?: PlanWhereInput | PlanWhereInput[]
    OR?: PlanWhereInput[]
    NOT?: PlanWhereInput | PlanWhereInput[]
    id?: StringFilter<"Plan"> | string
    name?: StringFilter<"Plan"> | string
    reqMin?: IntFilter<"Plan"> | number
    reqMonth?: IntFilter<"Plan"> | number
    maxPageSize?: IntFilter<"Plan"> | number
    maxDateRangeDays?: IntFilter<"Plan"> | number
    users?: UserListRelationFilter
  }

  export type PlanOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    reqMin?: SortOrder
    reqMonth?: SortOrder
    maxPageSize?: SortOrder
    maxDateRangeDays?: SortOrder
    users?: UserOrderByRelationAggregateInput
  }

  export type PlanWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: PlanWhereInput | PlanWhereInput[]
    OR?: PlanWhereInput[]
    NOT?: PlanWhereInput | PlanWhereInput[]
    reqMin?: IntFilter<"Plan"> | number
    reqMonth?: IntFilter<"Plan"> | number
    maxPageSize?: IntFilter<"Plan"> | number
    maxDateRangeDays?: IntFilter<"Plan"> | number
    users?: UserListRelationFilter
  }, "id" | "name">

  export type PlanOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    reqMin?: SortOrder
    reqMonth?: SortOrder
    maxPageSize?: SortOrder
    maxDateRangeDays?: SortOrder
    _count?: PlanCountOrderByAggregateInput
    _avg?: PlanAvgOrderByAggregateInput
    _max?: PlanMaxOrderByAggregateInput
    _min?: PlanMinOrderByAggregateInput
    _sum?: PlanSumOrderByAggregateInput
  }

  export type PlanScalarWhereWithAggregatesInput = {
    AND?: PlanScalarWhereWithAggregatesInput | PlanScalarWhereWithAggregatesInput[]
    OR?: PlanScalarWhereWithAggregatesInput[]
    NOT?: PlanScalarWhereWithAggregatesInput | PlanScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Plan"> | string
    name?: StringWithAggregatesFilter<"Plan"> | string
    reqMin?: IntWithAggregatesFilter<"Plan"> | number
    reqMonth?: IntWithAggregatesFilter<"Plan"> | number
    maxPageSize?: IntWithAggregatesFilter<"Plan"> | number
    maxDateRangeDays?: IntWithAggregatesFilter<"Plan"> | number
  }

  export type RequestLogWhereInput = {
    AND?: RequestLogWhereInput | RequestLogWhereInput[]
    OR?: RequestLogWhereInput[]
    NOT?: RequestLogWhereInput | RequestLogWhereInput[]
    id?: StringFilter<"RequestLog"> | string
    userId?: StringFilter<"RequestLog"> | string
    method?: StringFilter<"RequestLog"> | string
    path?: StringFilter<"RequestLog"> | string
    status?: IntFilter<"RequestLog"> | number
    ip?: StringNullableFilter<"RequestLog"> | string | null
    durationMs?: FloatNullableFilter<"RequestLog"> | number | null
    createdAt?: DateTimeFilter<"RequestLog"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type RequestLogOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    method?: SortOrder
    path?: SortOrder
    status?: SortOrder
    ip?: SortOrderInput | SortOrder
    durationMs?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type RequestLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RequestLogWhereInput | RequestLogWhereInput[]
    OR?: RequestLogWhereInput[]
    NOT?: RequestLogWhereInput | RequestLogWhereInput[]
    userId?: StringFilter<"RequestLog"> | string
    method?: StringFilter<"RequestLog"> | string
    path?: StringFilter<"RequestLog"> | string
    status?: IntFilter<"RequestLog"> | number
    ip?: StringNullableFilter<"RequestLog"> | string | null
    durationMs?: FloatNullableFilter<"RequestLog"> | number | null
    createdAt?: DateTimeFilter<"RequestLog"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type RequestLogOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    method?: SortOrder
    path?: SortOrder
    status?: SortOrder
    ip?: SortOrderInput | SortOrder
    durationMs?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: RequestLogCountOrderByAggregateInput
    _avg?: RequestLogAvgOrderByAggregateInput
    _max?: RequestLogMaxOrderByAggregateInput
    _min?: RequestLogMinOrderByAggregateInput
    _sum?: RequestLogSumOrderByAggregateInput
  }

  export type RequestLogScalarWhereWithAggregatesInput = {
    AND?: RequestLogScalarWhereWithAggregatesInput | RequestLogScalarWhereWithAggregatesInput[]
    OR?: RequestLogScalarWhereWithAggregatesInput[]
    NOT?: RequestLogScalarWhereWithAggregatesInput | RequestLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RequestLog"> | string
    userId?: StringWithAggregatesFilter<"RequestLog"> | string
    method?: StringWithAggregatesFilter<"RequestLog"> | string
    path?: StringWithAggregatesFilter<"RequestLog"> | string
    status?: IntWithAggregatesFilter<"RequestLog"> | number
    ip?: StringNullableWithAggregatesFilter<"RequestLog"> | string | null
    durationMs?: FloatNullableWithAggregatesFilter<"RequestLog"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"RequestLog"> | Date | string
  }

  export type UserInvitationWhereInput = {
    AND?: UserInvitationWhereInput | UserInvitationWhereInput[]
    OR?: UserInvitationWhereInput[]
    NOT?: UserInvitationWhereInput | UserInvitationWhereInput[]
    id?: StringFilter<"UserInvitation"> | string
    userId?: StringFilter<"UserInvitation"> | string
    token?: StringFilter<"UserInvitation"> | string
    createdAt?: DateTimeFilter<"UserInvitation"> | Date | string
    expiresAt?: DateTimeFilter<"UserInvitation"> | Date | string
    acceptedAt?: DateTimeNullableFilter<"UserInvitation"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type UserInvitationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    acceptedAt?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type UserInvitationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    token?: string
    AND?: UserInvitationWhereInput | UserInvitationWhereInput[]
    OR?: UserInvitationWhereInput[]
    NOT?: UserInvitationWhereInput | UserInvitationWhereInput[]
    createdAt?: DateTimeFilter<"UserInvitation"> | Date | string
    expiresAt?: DateTimeFilter<"UserInvitation"> | Date | string
    acceptedAt?: DateTimeNullableFilter<"UserInvitation"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId" | "token">

  export type UserInvitationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    acceptedAt?: SortOrderInput | SortOrder
    _count?: UserInvitationCountOrderByAggregateInput
    _max?: UserInvitationMaxOrderByAggregateInput
    _min?: UserInvitationMinOrderByAggregateInput
  }

  export type UserInvitationScalarWhereWithAggregatesInput = {
    AND?: UserInvitationScalarWhereWithAggregatesInput | UserInvitationScalarWhereWithAggregatesInput[]
    OR?: UserInvitationScalarWhereWithAggregatesInput[]
    NOT?: UserInvitationScalarWhereWithAggregatesInput | UserInvitationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserInvitation"> | string
    userId?: StringWithAggregatesFilter<"UserInvitation"> | string
    token?: StringWithAggregatesFilter<"UserInvitation"> | string
    createdAt?: DateTimeWithAggregatesFilter<"UserInvitation"> | Date | string
    expiresAt?: DateTimeWithAggregatesFilter<"UserInvitation"> | Date | string
    acceptedAt?: DateTimeNullableWithAggregatesFilter<"UserInvitation"> | Date | string | null
  }

  export type DbCredentialsWhereInput = {
    AND?: DbCredentialsWhereInput | DbCredentialsWhereInput[]
    OR?: DbCredentialsWhereInput[]
    NOT?: DbCredentialsWhereInput | DbCredentialsWhereInput[]
    id?: StringFilter<"DbCredentials"> | string
    host?: StringFilter<"DbCredentials"> | string
    port?: IntFilter<"DbCredentials"> | number
    database?: StringFilter<"DbCredentials"> | string
    user?: StringFilter<"DbCredentials"> | string
    dbId?: IntFilter<"DbCredentials"> | number
    users?: UserListRelationFilter
  }

  export type DbCredentialsOrderByWithRelationInput = {
    id?: SortOrder
    host?: SortOrder
    port?: SortOrder
    database?: SortOrder
    user?: SortOrder
    dbId?: SortOrder
    users?: UserOrderByRelationAggregateInput
  }

  export type DbCredentialsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DbCredentialsWhereInput | DbCredentialsWhereInput[]
    OR?: DbCredentialsWhereInput[]
    NOT?: DbCredentialsWhereInput | DbCredentialsWhereInput[]
    host?: StringFilter<"DbCredentials"> | string
    port?: IntFilter<"DbCredentials"> | number
    database?: StringFilter<"DbCredentials"> | string
    user?: StringFilter<"DbCredentials"> | string
    dbId?: IntFilter<"DbCredentials"> | number
    users?: UserListRelationFilter
  }, "id">

  export type DbCredentialsOrderByWithAggregationInput = {
    id?: SortOrder
    host?: SortOrder
    port?: SortOrder
    database?: SortOrder
    user?: SortOrder
    dbId?: SortOrder
    _count?: DbCredentialsCountOrderByAggregateInput
    _avg?: DbCredentialsAvgOrderByAggregateInput
    _max?: DbCredentialsMaxOrderByAggregateInput
    _min?: DbCredentialsMinOrderByAggregateInput
    _sum?: DbCredentialsSumOrderByAggregateInput
  }

  export type DbCredentialsScalarWhereWithAggregatesInput = {
    AND?: DbCredentialsScalarWhereWithAggregatesInput | DbCredentialsScalarWhereWithAggregatesInput[]
    OR?: DbCredentialsScalarWhereWithAggregatesInput[]
    NOT?: DbCredentialsScalarWhereWithAggregatesInput | DbCredentialsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DbCredentials"> | string
    host?: StringWithAggregatesFilter<"DbCredentials"> | string
    port?: IntWithAggregatesFilter<"DbCredentials"> | number
    database?: StringWithAggregatesFilter<"DbCredentials"> | string
    user?: StringWithAggregatesFilter<"DbCredentials"> | string
    dbId?: IntWithAggregatesFilter<"DbCredentials"> | number
  }

  export type RoleWhereInput = {
    AND?: RoleWhereInput | RoleWhereInput[]
    OR?: RoleWhereInput[]
    NOT?: RoleWhereInput | RoleWhereInput[]
    id?: StringFilter<"Role"> | string
    name?: StringFilter<"Role"> | string
    description?: StringNullableFilter<"Role"> | string | null
    rolePermissions?: RolePermissionListRelationFilter
    users?: UserListRelationFilter
  }

  export type RoleOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    rolePermissions?: RolePermissionOrderByRelationAggregateInput
    users?: UserOrderByRelationAggregateInput
  }

  export type RoleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RoleWhereInput | RoleWhereInput[]
    OR?: RoleWhereInput[]
    NOT?: RoleWhereInput | RoleWhereInput[]
    name?: StringFilter<"Role"> | string
    description?: StringNullableFilter<"Role"> | string | null
    rolePermissions?: RolePermissionListRelationFilter
    users?: UserListRelationFilter
  }, "id">

  export type RoleOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    _count?: RoleCountOrderByAggregateInput
    _max?: RoleMaxOrderByAggregateInput
    _min?: RoleMinOrderByAggregateInput
  }

  export type RoleScalarWhereWithAggregatesInput = {
    AND?: RoleScalarWhereWithAggregatesInput | RoleScalarWhereWithAggregatesInput[]
    OR?: RoleScalarWhereWithAggregatesInput[]
    NOT?: RoleScalarWhereWithAggregatesInput | RoleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Role"> | string
    name?: StringWithAggregatesFilter<"Role"> | string
    description?: StringNullableWithAggregatesFilter<"Role"> | string | null
  }

  export type PermissionWhereInput = {
    AND?: PermissionWhereInput | PermissionWhereInput[]
    OR?: PermissionWhereInput[]
    NOT?: PermissionWhereInput | PermissionWhereInput[]
    id?: StringFilter<"Permission"> | string
    key?: StringFilter<"Permission"> | string
    name?: StringFilter<"Permission"> | string
    description?: StringNullableFilter<"Permission"> | string | null
    rolePermissions?: RolePermissionListRelationFilter
  }

  export type PermissionOrderByWithRelationInput = {
    id?: SortOrder
    key?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    rolePermissions?: RolePermissionOrderByRelationAggregateInput
  }

  export type PermissionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    key?: string
    AND?: PermissionWhereInput | PermissionWhereInput[]
    OR?: PermissionWhereInput[]
    NOT?: PermissionWhereInput | PermissionWhereInput[]
    name?: StringFilter<"Permission"> | string
    description?: StringNullableFilter<"Permission"> | string | null
    rolePermissions?: RolePermissionListRelationFilter
  }, "id" | "key">

  export type PermissionOrderByWithAggregationInput = {
    id?: SortOrder
    key?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    _count?: PermissionCountOrderByAggregateInput
    _max?: PermissionMaxOrderByAggregateInput
    _min?: PermissionMinOrderByAggregateInput
  }

  export type PermissionScalarWhereWithAggregatesInput = {
    AND?: PermissionScalarWhereWithAggregatesInput | PermissionScalarWhereWithAggregatesInput[]
    OR?: PermissionScalarWhereWithAggregatesInput[]
    NOT?: PermissionScalarWhereWithAggregatesInput | PermissionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Permission"> | string
    key?: StringWithAggregatesFilter<"Permission"> | string
    name?: StringWithAggregatesFilter<"Permission"> | string
    description?: StringNullableWithAggregatesFilter<"Permission"> | string | null
  }

  export type RolePermissionWhereInput = {
    AND?: RolePermissionWhereInput | RolePermissionWhereInput[]
    OR?: RolePermissionWhereInput[]
    NOT?: RolePermissionWhereInput | RolePermissionWhereInput[]
    roleId?: StringFilter<"RolePermission"> | string
    permissionId?: StringFilter<"RolePermission"> | string
    permission?: XOR<PermissionScalarRelationFilter, PermissionWhereInput>
    role?: XOR<RoleScalarRelationFilter, RoleWhereInput>
  }

  export type RolePermissionOrderByWithRelationInput = {
    roleId?: SortOrder
    permissionId?: SortOrder
    permission?: PermissionOrderByWithRelationInput
    role?: RoleOrderByWithRelationInput
  }

  export type RolePermissionWhereUniqueInput = Prisma.AtLeast<{
    roleId_permissionId?: RolePermissionRoleIdPermissionIdCompoundUniqueInput
    AND?: RolePermissionWhereInput | RolePermissionWhereInput[]
    OR?: RolePermissionWhereInput[]
    NOT?: RolePermissionWhereInput | RolePermissionWhereInput[]
    roleId?: StringFilter<"RolePermission"> | string
    permissionId?: StringFilter<"RolePermission"> | string
    permission?: XOR<PermissionScalarRelationFilter, PermissionWhereInput>
    role?: XOR<RoleScalarRelationFilter, RoleWhereInput>
  }, "roleId_permissionId">

  export type RolePermissionOrderByWithAggregationInput = {
    roleId?: SortOrder
    permissionId?: SortOrder
    _count?: RolePermissionCountOrderByAggregateInput
    _max?: RolePermissionMaxOrderByAggregateInput
    _min?: RolePermissionMinOrderByAggregateInput
  }

  export type RolePermissionScalarWhereWithAggregatesInput = {
    AND?: RolePermissionScalarWhereWithAggregatesInput | RolePermissionScalarWhereWithAggregatesInput[]
    OR?: RolePermissionScalarWhereWithAggregatesInput[]
    NOT?: RolePermissionScalarWhereWithAggregatesInput | RolePermissionScalarWhereWithAggregatesInput[]
    roleId?: StringWithAggregatesFilter<"RolePermission"> | string
    permissionId?: StringWithAggregatesFilter<"RolePermission"> | string
  }

  export type IntegrationRequestWhereInput = {
    AND?: IntegrationRequestWhereInput | IntegrationRequestWhereInput[]
    OR?: IntegrationRequestWhereInput[]
    NOT?: IntegrationRequestWhereInput | IntegrationRequestWhereInput[]
    id?: StringFilter<"IntegrationRequest"> | string
    clientName?: StringFilter<"IntegrationRequest"> | string
    hostingType?: EnumHostingTypeFilter<"IntegrationRequest"> | $Enums.HostingType
    fixedIp?: StringNullableFilter<"IntegrationRequest"> | string | null
    database?: JsonFilter<"IntegrationRequest">
    scopes?: JsonFilter<"IntegrationRequest">
    objective?: StringFilter<"IntegrationRequest"> | string
    technicalContact?: JsonFilter<"IntegrationRequest">
    responsiblePerson?: JsonFilter<"IntegrationRequest">
    status?: StringFilter<"IntegrationRequest"> | string
    createdAt?: DateTimeFilter<"IntegrationRequest"> | Date | string
    updatedAt?: DateTimeFilter<"IntegrationRequest"> | Date | string
    modules?: StringNullableListFilter<"IntegrationRequest">
    cnpj?: StringNullableFilter<"IntegrationRequest"> | string | null
    legalName?: StringFilter<"IntegrationRequest"> | string
    rejectionReason?: StringNullableFilter<"IntegrationRequest"> | string | null
  }

  export type IntegrationRequestOrderByWithRelationInput = {
    id?: SortOrder
    clientName?: SortOrder
    hostingType?: SortOrder
    fixedIp?: SortOrderInput | SortOrder
    database?: SortOrder
    scopes?: SortOrder
    objective?: SortOrder
    technicalContact?: SortOrder
    responsiblePerson?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    modules?: SortOrder
    cnpj?: SortOrderInput | SortOrder
    legalName?: SortOrder
    rejectionReason?: SortOrderInput | SortOrder
  }

  export type IntegrationRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: IntegrationRequestWhereInput | IntegrationRequestWhereInput[]
    OR?: IntegrationRequestWhereInput[]
    NOT?: IntegrationRequestWhereInput | IntegrationRequestWhereInput[]
    clientName?: StringFilter<"IntegrationRequest"> | string
    hostingType?: EnumHostingTypeFilter<"IntegrationRequest"> | $Enums.HostingType
    fixedIp?: StringNullableFilter<"IntegrationRequest"> | string | null
    database?: JsonFilter<"IntegrationRequest">
    scopes?: JsonFilter<"IntegrationRequest">
    objective?: StringFilter<"IntegrationRequest"> | string
    technicalContact?: JsonFilter<"IntegrationRequest">
    responsiblePerson?: JsonFilter<"IntegrationRequest">
    status?: StringFilter<"IntegrationRequest"> | string
    createdAt?: DateTimeFilter<"IntegrationRequest"> | Date | string
    updatedAt?: DateTimeFilter<"IntegrationRequest"> | Date | string
    modules?: StringNullableListFilter<"IntegrationRequest">
    cnpj?: StringNullableFilter<"IntegrationRequest"> | string | null
    legalName?: StringFilter<"IntegrationRequest"> | string
    rejectionReason?: StringNullableFilter<"IntegrationRequest"> | string | null
  }, "id">

  export type IntegrationRequestOrderByWithAggregationInput = {
    id?: SortOrder
    clientName?: SortOrder
    hostingType?: SortOrder
    fixedIp?: SortOrderInput | SortOrder
    database?: SortOrder
    scopes?: SortOrder
    objective?: SortOrder
    technicalContact?: SortOrder
    responsiblePerson?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    modules?: SortOrder
    cnpj?: SortOrderInput | SortOrder
    legalName?: SortOrder
    rejectionReason?: SortOrderInput | SortOrder
    _count?: IntegrationRequestCountOrderByAggregateInput
    _max?: IntegrationRequestMaxOrderByAggregateInput
    _min?: IntegrationRequestMinOrderByAggregateInput
  }

  export type IntegrationRequestScalarWhereWithAggregatesInput = {
    AND?: IntegrationRequestScalarWhereWithAggregatesInput | IntegrationRequestScalarWhereWithAggregatesInput[]
    OR?: IntegrationRequestScalarWhereWithAggregatesInput[]
    NOT?: IntegrationRequestScalarWhereWithAggregatesInput | IntegrationRequestScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"IntegrationRequest"> | string
    clientName?: StringWithAggregatesFilter<"IntegrationRequest"> | string
    hostingType?: EnumHostingTypeWithAggregatesFilter<"IntegrationRequest"> | $Enums.HostingType
    fixedIp?: StringNullableWithAggregatesFilter<"IntegrationRequest"> | string | null
    database?: JsonWithAggregatesFilter<"IntegrationRequest">
    scopes?: JsonWithAggregatesFilter<"IntegrationRequest">
    objective?: StringWithAggregatesFilter<"IntegrationRequest"> | string
    technicalContact?: JsonWithAggregatesFilter<"IntegrationRequest">
    responsiblePerson?: JsonWithAggregatesFilter<"IntegrationRequest">
    status?: StringWithAggregatesFilter<"IntegrationRequest"> | string
    createdAt?: DateTimeWithAggregatesFilter<"IntegrationRequest"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"IntegrationRequest"> | Date | string
    modules?: StringNullableListFilter<"IntegrationRequest">
    cnpj?: StringNullableWithAggregatesFilter<"IntegrationRequest"> | string | null
    legalName?: StringWithAggregatesFilter<"IntegrationRequest"> | string
    rejectionReason?: StringNullableWithAggregatesFilter<"IntegrationRequest"> | string | null
  }

  export type AnnouncementWhereInput = {
    AND?: AnnouncementWhereInput | AnnouncementWhereInput[]
    OR?: AnnouncementWhereInput[]
    NOT?: AnnouncementWhereInput | AnnouncementWhereInput[]
    id?: StringFilter<"Announcement"> | string
    type?: EnumAnnouncementTypeFilter<"Announcement"> | $Enums.AnnouncementType
    text?: StringFilter<"Announcement"> | string
    ctaText?: StringNullableFilter<"Announcement"> | string | null
    ctaLink?: StringNullableFilter<"Announcement"> | string | null
    startDate?: DateTimeNullableFilter<"Announcement"> | Date | string | null
    endDate?: DateTimeNullableFilter<"Announcement"> | Date | string | null
    active?: BoolFilter<"Announcement"> | boolean
    newsletterId?: IntNullableFilter<"Announcement"> | number | null
    createdAt?: DateTimeFilter<"Announcement"> | Date | string
    updatedAt?: DateTimeFilter<"Announcement"> | Date | string
    views?: AnnouncementViewListRelationFilter
    newsletter?: XOR<NewsletterNullableScalarRelationFilter, NewsletterWhereInput> | null
  }

  export type AnnouncementOrderByWithRelationInput = {
    id?: SortOrder
    type?: SortOrder
    text?: SortOrder
    ctaText?: SortOrderInput | SortOrder
    ctaLink?: SortOrderInput | SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    active?: SortOrder
    newsletterId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    views?: AnnouncementViewOrderByRelationAggregateInput
    newsletter?: NewsletterOrderByWithRelationInput
  }

  export type AnnouncementWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AnnouncementWhereInput | AnnouncementWhereInput[]
    OR?: AnnouncementWhereInput[]
    NOT?: AnnouncementWhereInput | AnnouncementWhereInput[]
    type?: EnumAnnouncementTypeFilter<"Announcement"> | $Enums.AnnouncementType
    text?: StringFilter<"Announcement"> | string
    ctaText?: StringNullableFilter<"Announcement"> | string | null
    ctaLink?: StringNullableFilter<"Announcement"> | string | null
    startDate?: DateTimeNullableFilter<"Announcement"> | Date | string | null
    endDate?: DateTimeNullableFilter<"Announcement"> | Date | string | null
    active?: BoolFilter<"Announcement"> | boolean
    newsletterId?: IntNullableFilter<"Announcement"> | number | null
    createdAt?: DateTimeFilter<"Announcement"> | Date | string
    updatedAt?: DateTimeFilter<"Announcement"> | Date | string
    views?: AnnouncementViewListRelationFilter
    newsletter?: XOR<NewsletterNullableScalarRelationFilter, NewsletterWhereInput> | null
  }, "id">

  export type AnnouncementOrderByWithAggregationInput = {
    id?: SortOrder
    type?: SortOrder
    text?: SortOrder
    ctaText?: SortOrderInput | SortOrder
    ctaLink?: SortOrderInput | SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    active?: SortOrder
    newsletterId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AnnouncementCountOrderByAggregateInput
    _avg?: AnnouncementAvgOrderByAggregateInput
    _max?: AnnouncementMaxOrderByAggregateInput
    _min?: AnnouncementMinOrderByAggregateInput
    _sum?: AnnouncementSumOrderByAggregateInput
  }

  export type AnnouncementScalarWhereWithAggregatesInput = {
    AND?: AnnouncementScalarWhereWithAggregatesInput | AnnouncementScalarWhereWithAggregatesInput[]
    OR?: AnnouncementScalarWhereWithAggregatesInput[]
    NOT?: AnnouncementScalarWhereWithAggregatesInput | AnnouncementScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Announcement"> | string
    type?: EnumAnnouncementTypeWithAggregatesFilter<"Announcement"> | $Enums.AnnouncementType
    text?: StringWithAggregatesFilter<"Announcement"> | string
    ctaText?: StringNullableWithAggregatesFilter<"Announcement"> | string | null
    ctaLink?: StringNullableWithAggregatesFilter<"Announcement"> | string | null
    startDate?: DateTimeNullableWithAggregatesFilter<"Announcement"> | Date | string | null
    endDate?: DateTimeNullableWithAggregatesFilter<"Announcement"> | Date | string | null
    active?: BoolWithAggregatesFilter<"Announcement"> | boolean
    newsletterId?: IntNullableWithAggregatesFilter<"Announcement"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"Announcement"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Announcement"> | Date | string
  }

  export type NewsletterWhereInput = {
    AND?: NewsletterWhereInput | NewsletterWhereInput[]
    OR?: NewsletterWhereInput[]
    NOT?: NewsletterWhereInput | NewsletterWhereInput[]
    id?: IntFilter<"Newsletter"> | number
    subject?: StringFilter<"Newsletter"> | string
    initialMessage?: StringNullableFilter<"Newsletter"> | string | null
    finalMessage?: StringNullableFilter<"Newsletter"> | string | null
    sentAt?: DateTimeFilter<"Newsletter"> | Date | string
    announcements?: AnnouncementListRelationFilter
  }

  export type NewsletterOrderByWithRelationInput = {
    id?: SortOrder
    subject?: SortOrder
    initialMessage?: SortOrderInput | SortOrder
    finalMessage?: SortOrderInput | SortOrder
    sentAt?: SortOrder
    announcements?: AnnouncementOrderByRelationAggregateInput
  }

  export type NewsletterWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: NewsletterWhereInput | NewsletterWhereInput[]
    OR?: NewsletterWhereInput[]
    NOT?: NewsletterWhereInput | NewsletterWhereInput[]
    subject?: StringFilter<"Newsletter"> | string
    initialMessage?: StringNullableFilter<"Newsletter"> | string | null
    finalMessage?: StringNullableFilter<"Newsletter"> | string | null
    sentAt?: DateTimeFilter<"Newsletter"> | Date | string
    announcements?: AnnouncementListRelationFilter
  }, "id">

  export type NewsletterOrderByWithAggregationInput = {
    id?: SortOrder
    subject?: SortOrder
    initialMessage?: SortOrderInput | SortOrder
    finalMessage?: SortOrderInput | SortOrder
    sentAt?: SortOrder
    _count?: NewsletterCountOrderByAggregateInput
    _avg?: NewsletterAvgOrderByAggregateInput
    _max?: NewsletterMaxOrderByAggregateInput
    _min?: NewsletterMinOrderByAggregateInput
    _sum?: NewsletterSumOrderByAggregateInput
  }

  export type NewsletterScalarWhereWithAggregatesInput = {
    AND?: NewsletterScalarWhereWithAggregatesInput | NewsletterScalarWhereWithAggregatesInput[]
    OR?: NewsletterScalarWhereWithAggregatesInput[]
    NOT?: NewsletterScalarWhereWithAggregatesInput | NewsletterScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Newsletter"> | number
    subject?: StringWithAggregatesFilter<"Newsletter"> | string
    initialMessage?: StringNullableWithAggregatesFilter<"Newsletter"> | string | null
    finalMessage?: StringNullableWithAggregatesFilter<"Newsletter"> | string | null
    sentAt?: DateTimeWithAggregatesFilter<"Newsletter"> | Date | string
  }

  export type AnnouncementViewWhereInput = {
    AND?: AnnouncementViewWhereInput | AnnouncementViewWhereInput[]
    OR?: AnnouncementViewWhereInput[]
    NOT?: AnnouncementViewWhereInput | AnnouncementViewWhereInput[]
    id?: StringFilter<"AnnouncementView"> | string
    announcementId?: StringFilter<"AnnouncementView"> | string
    userId?: StringFilter<"AnnouncementView"> | string
    viewedAt?: DateTimeFilter<"AnnouncementView"> | Date | string
    announcement?: XOR<AnnouncementScalarRelationFilter, AnnouncementWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AnnouncementViewOrderByWithRelationInput = {
    id?: SortOrder
    announcementId?: SortOrder
    userId?: SortOrder
    viewedAt?: SortOrder
    announcement?: AnnouncementOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type AnnouncementViewWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    announcementId_userId?: AnnouncementViewAnnouncementIdUserIdCompoundUniqueInput
    AND?: AnnouncementViewWhereInput | AnnouncementViewWhereInput[]
    OR?: AnnouncementViewWhereInput[]
    NOT?: AnnouncementViewWhereInput | AnnouncementViewWhereInput[]
    announcementId?: StringFilter<"AnnouncementView"> | string
    userId?: StringFilter<"AnnouncementView"> | string
    viewedAt?: DateTimeFilter<"AnnouncementView"> | Date | string
    announcement?: XOR<AnnouncementScalarRelationFilter, AnnouncementWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "announcementId_userId">

  export type AnnouncementViewOrderByWithAggregationInput = {
    id?: SortOrder
    announcementId?: SortOrder
    userId?: SortOrder
    viewedAt?: SortOrder
    _count?: AnnouncementViewCountOrderByAggregateInput
    _max?: AnnouncementViewMaxOrderByAggregateInput
    _min?: AnnouncementViewMinOrderByAggregateInput
  }

  export type AnnouncementViewScalarWhereWithAggregatesInput = {
    AND?: AnnouncementViewScalarWhereWithAggregatesInput | AnnouncementViewScalarWhereWithAggregatesInput[]
    OR?: AnnouncementViewScalarWhereWithAggregatesInput[]
    NOT?: AnnouncementViewScalarWhereWithAggregatesInput | AnnouncementViewScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AnnouncementView"> | string
    announcementId?: StringWithAggregatesFilter<"AnnouncementView"> | string
    userId?: StringWithAggregatesFilter<"AnnouncementView"> | string
    viewedAt?: DateTimeWithAggregatesFilter<"AnnouncementView"> | Date | string
  }

  export type StatusLogWhereInput = {
    AND?: StatusLogWhereInput | StatusLogWhereInput[]
    OR?: StatusLogWhereInput[]
    NOT?: StatusLogWhereInput | StatusLogWhereInput[]
    id?: StringFilter<"StatusLog"> | string
    apiStatus?: StringFilter<"StatusLog"> | string
    apiLatency?: IntFilter<"StatusLog"> | number
    dbStatus?: StringFilter<"StatusLog"> | string
    dbLatency?: IntFilter<"StatusLog"> | number
    timestamp?: DateTimeFilter<"StatusLog"> | Date | string
  }

  export type StatusLogOrderByWithRelationInput = {
    id?: SortOrder
    apiStatus?: SortOrder
    apiLatency?: SortOrder
    dbStatus?: SortOrder
    dbLatency?: SortOrder
    timestamp?: SortOrder
  }

  export type StatusLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: StatusLogWhereInput | StatusLogWhereInput[]
    OR?: StatusLogWhereInput[]
    NOT?: StatusLogWhereInput | StatusLogWhereInput[]
    apiStatus?: StringFilter<"StatusLog"> | string
    apiLatency?: IntFilter<"StatusLog"> | number
    dbStatus?: StringFilter<"StatusLog"> | string
    dbLatency?: IntFilter<"StatusLog"> | number
    timestamp?: DateTimeFilter<"StatusLog"> | Date | string
  }, "id">

  export type StatusLogOrderByWithAggregationInput = {
    id?: SortOrder
    apiStatus?: SortOrder
    apiLatency?: SortOrder
    dbStatus?: SortOrder
    dbLatency?: SortOrder
    timestamp?: SortOrder
    _count?: StatusLogCountOrderByAggregateInput
    _avg?: StatusLogAvgOrderByAggregateInput
    _max?: StatusLogMaxOrderByAggregateInput
    _min?: StatusLogMinOrderByAggregateInput
    _sum?: StatusLogSumOrderByAggregateInput
  }

  export type StatusLogScalarWhereWithAggregatesInput = {
    AND?: StatusLogScalarWhereWithAggregatesInput | StatusLogScalarWhereWithAggregatesInput[]
    OR?: StatusLogScalarWhereWithAggregatesInput[]
    NOT?: StatusLogScalarWhereWithAggregatesInput | StatusLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"StatusLog"> | string
    apiStatus?: StringWithAggregatesFilter<"StatusLog"> | string
    apiLatency?: IntWithAggregatesFilter<"StatusLog"> | number
    dbStatus?: StringWithAggregatesFilter<"StatusLog"> | string
    dbLatency?: IntWithAggregatesFilter<"StatusLog"> | number
    timestamp?: DateTimeWithAggregatesFilter<"StatusLog"> | Date | string
  }

  export type SystemHeartbeatWhereInput = {
    AND?: SystemHeartbeatWhereInput | SystemHeartbeatWhereInput[]
    OR?: SystemHeartbeatWhereInput[]
    NOT?: SystemHeartbeatWhereInput | SystemHeartbeatWhereInput[]
    id?: StringFilter<"SystemHeartbeat"> | string
    service?: StringFilter<"SystemHeartbeat"> | string
    timestamp?: DateTimeFilter<"SystemHeartbeat"> | Date | string
  }

  export type SystemHeartbeatOrderByWithRelationInput = {
    id?: SortOrder
    service?: SortOrder
    timestamp?: SortOrder
  }

  export type SystemHeartbeatWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    service?: string
    AND?: SystemHeartbeatWhereInput | SystemHeartbeatWhereInput[]
    OR?: SystemHeartbeatWhereInput[]
    NOT?: SystemHeartbeatWhereInput | SystemHeartbeatWhereInput[]
    timestamp?: DateTimeFilter<"SystemHeartbeat"> | Date | string
  }, "id" | "service">

  export type SystemHeartbeatOrderByWithAggregationInput = {
    id?: SortOrder
    service?: SortOrder
    timestamp?: SortOrder
    _count?: SystemHeartbeatCountOrderByAggregateInput
    _max?: SystemHeartbeatMaxOrderByAggregateInput
    _min?: SystemHeartbeatMinOrderByAggregateInput
  }

  export type SystemHeartbeatScalarWhereWithAggregatesInput = {
    AND?: SystemHeartbeatScalarWhereWithAggregatesInput | SystemHeartbeatScalarWhereWithAggregatesInput[]
    OR?: SystemHeartbeatScalarWhereWithAggregatesInput[]
    NOT?: SystemHeartbeatScalarWhereWithAggregatesInput | SystemHeartbeatScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SystemHeartbeat"> | string
    service?: StringWithAggregatesFilter<"SystemHeartbeat"> | string
    timestamp?: DateTimeWithAggregatesFilter<"SystemHeartbeat"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    user: string
    passwordHash: string
    status?: boolean
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    storeId?: number
    dbCredentials: DbCredentialsCreateNestedOneWithoutUsersInput
    role?: RoleCreateNestedOneWithoutUsersInput
    plan?: PlanCreateNestedOneWithoutUsersInput
    invitation?: UserInvitationCreateNestedOneWithoutUserInput
    requestLogs?: RequestLogCreateNestedManyWithoutUserInput
    announcementViews?: AnnouncementViewCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    user: string
    passwordHash: string
    status?: boolean
    dbCredentialsId: string
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    storeId?: number
    roleId?: string | null
    planId?: string | null
    invitation?: UserInvitationUncheckedCreateNestedOneWithoutUserInput
    requestLogs?: RequestLogUncheckedCreateNestedManyWithoutUserInput
    announcementViews?: AnnouncementViewUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    status?: BoolFieldUpdateOperationsInput | boolean
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storeId?: IntFieldUpdateOperationsInput | number
    dbCredentials?: DbCredentialsUpdateOneRequiredWithoutUsersNestedInput
    role?: RoleUpdateOneWithoutUsersNestedInput
    plan?: PlanUpdateOneWithoutUsersNestedInput
    invitation?: UserInvitationUpdateOneWithoutUserNestedInput
    requestLogs?: RequestLogUpdateManyWithoutUserNestedInput
    announcementViews?: AnnouncementViewUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    status?: BoolFieldUpdateOperationsInput | boolean
    dbCredentialsId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storeId?: IntFieldUpdateOperationsInput | number
    roleId?: NullableStringFieldUpdateOperationsInput | string | null
    planId?: NullableStringFieldUpdateOperationsInput | string | null
    invitation?: UserInvitationUncheckedUpdateOneWithoutUserNestedInput
    requestLogs?: RequestLogUncheckedUpdateManyWithoutUserNestedInput
    announcementViews?: AnnouncementViewUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    user: string
    passwordHash: string
    status?: boolean
    dbCredentialsId: string
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    storeId?: number
    roleId?: string | null
    planId?: string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    user?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    status?: BoolFieldUpdateOperationsInput | boolean
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storeId?: IntFieldUpdateOperationsInput | number
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    user?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    status?: BoolFieldUpdateOperationsInput | boolean
    dbCredentialsId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storeId?: IntFieldUpdateOperationsInput | number
    roleId?: NullableStringFieldUpdateOperationsInput | string | null
    planId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PlanCreateInput = {
    id?: string
    name: string
    reqMin: number
    reqMonth: number
    maxPageSize: number
    maxDateRangeDays: number
    users?: UserCreateNestedManyWithoutPlanInput
  }

  export type PlanUncheckedCreateInput = {
    id?: string
    name: string
    reqMin: number
    reqMonth: number
    maxPageSize: number
    maxDateRangeDays: number
    users?: UserUncheckedCreateNestedManyWithoutPlanInput
  }

  export type PlanUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    reqMin?: IntFieldUpdateOperationsInput | number
    reqMonth?: IntFieldUpdateOperationsInput | number
    maxPageSize?: IntFieldUpdateOperationsInput | number
    maxDateRangeDays?: IntFieldUpdateOperationsInput | number
    users?: UserUpdateManyWithoutPlanNestedInput
  }

  export type PlanUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    reqMin?: IntFieldUpdateOperationsInput | number
    reqMonth?: IntFieldUpdateOperationsInput | number
    maxPageSize?: IntFieldUpdateOperationsInput | number
    maxDateRangeDays?: IntFieldUpdateOperationsInput | number
    users?: UserUncheckedUpdateManyWithoutPlanNestedInput
  }

  export type PlanCreateManyInput = {
    id?: string
    name: string
    reqMin: number
    reqMonth: number
    maxPageSize: number
    maxDateRangeDays: number
  }

  export type PlanUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    reqMin?: IntFieldUpdateOperationsInput | number
    reqMonth?: IntFieldUpdateOperationsInput | number
    maxPageSize?: IntFieldUpdateOperationsInput | number
    maxDateRangeDays?: IntFieldUpdateOperationsInput | number
  }

  export type PlanUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    reqMin?: IntFieldUpdateOperationsInput | number
    reqMonth?: IntFieldUpdateOperationsInput | number
    maxPageSize?: IntFieldUpdateOperationsInput | number
    maxDateRangeDays?: IntFieldUpdateOperationsInput | number
  }

  export type RequestLogCreateInput = {
    id?: string
    method: string
    path: string
    status: number
    ip?: string | null
    durationMs?: number | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutRequestLogsInput
  }

  export type RequestLogUncheckedCreateInput = {
    id?: string
    userId: string
    method: string
    path: string
    status: number
    ip?: string | null
    durationMs?: number | null
    createdAt?: Date | string
  }

  export type RequestLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    method?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    durationMs?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutRequestLogsNestedInput
  }

  export type RequestLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    method?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    durationMs?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RequestLogCreateManyInput = {
    id?: string
    userId: string
    method: string
    path: string
    status: number
    ip?: string | null
    durationMs?: number | null
    createdAt?: Date | string
  }

  export type RequestLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    method?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    durationMs?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RequestLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    method?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    durationMs?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserInvitationCreateInput = {
    id?: string
    token: string
    createdAt?: Date | string
    expiresAt: Date | string
    acceptedAt?: Date | string | null
    user: UserCreateNestedOneWithoutInvitationInput
  }

  export type UserInvitationUncheckedCreateInput = {
    id?: string
    userId: string
    token: string
    createdAt?: Date | string
    expiresAt: Date | string
    acceptedAt?: Date | string | null
  }

  export type UserInvitationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    acceptedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutInvitationNestedInput
  }

  export type UserInvitationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    acceptedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserInvitationCreateManyInput = {
    id?: string
    userId: string
    token: string
    createdAt?: Date | string
    expiresAt: Date | string
    acceptedAt?: Date | string | null
  }

  export type UserInvitationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    acceptedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserInvitationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    acceptedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DbCredentialsCreateInput = {
    id?: string
    host: string
    port: number
    database: string
    user: string
    dbId: number
    users?: UserCreateNestedManyWithoutDbCredentialsInput
  }

  export type DbCredentialsUncheckedCreateInput = {
    id?: string
    host: string
    port: number
    database: string
    user: string
    dbId: number
    users?: UserUncheckedCreateNestedManyWithoutDbCredentialsInput
  }

  export type DbCredentialsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    database?: StringFieldUpdateOperationsInput | string
    user?: StringFieldUpdateOperationsInput | string
    dbId?: IntFieldUpdateOperationsInput | number
    users?: UserUpdateManyWithoutDbCredentialsNestedInput
  }

  export type DbCredentialsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    database?: StringFieldUpdateOperationsInput | string
    user?: StringFieldUpdateOperationsInput | string
    dbId?: IntFieldUpdateOperationsInput | number
    users?: UserUncheckedUpdateManyWithoutDbCredentialsNestedInput
  }

  export type DbCredentialsCreateManyInput = {
    id?: string
    host: string
    port: number
    database: string
    user: string
    dbId: number
  }

  export type DbCredentialsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    database?: StringFieldUpdateOperationsInput | string
    user?: StringFieldUpdateOperationsInput | string
    dbId?: IntFieldUpdateOperationsInput | number
  }

  export type DbCredentialsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    database?: StringFieldUpdateOperationsInput | string
    user?: StringFieldUpdateOperationsInput | string
    dbId?: IntFieldUpdateOperationsInput | number
  }

  export type RoleCreateInput = {
    id?: string
    name: string
    description?: string | null
    rolePermissions?: RolePermissionCreateNestedManyWithoutRoleInput
    users?: UserCreateNestedManyWithoutRoleInput
  }

  export type RoleUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    rolePermissions?: RolePermissionUncheckedCreateNestedManyWithoutRoleInput
    users?: UserUncheckedCreateNestedManyWithoutRoleInput
  }

  export type RoleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    rolePermissions?: RolePermissionUpdateManyWithoutRoleNestedInput
    users?: UserUpdateManyWithoutRoleNestedInput
  }

  export type RoleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    rolePermissions?: RolePermissionUncheckedUpdateManyWithoutRoleNestedInput
    users?: UserUncheckedUpdateManyWithoutRoleNestedInput
  }

  export type RoleCreateManyInput = {
    id?: string
    name: string
    description?: string | null
  }

  export type RoleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RoleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PermissionCreateInput = {
    id?: string
    key: string
    name: string
    description?: string | null
    rolePermissions?: RolePermissionCreateNestedManyWithoutPermissionInput
  }

  export type PermissionUncheckedCreateInput = {
    id?: string
    key: string
    name: string
    description?: string | null
    rolePermissions?: RolePermissionUncheckedCreateNestedManyWithoutPermissionInput
  }

  export type PermissionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    rolePermissions?: RolePermissionUpdateManyWithoutPermissionNestedInput
  }

  export type PermissionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    rolePermissions?: RolePermissionUncheckedUpdateManyWithoutPermissionNestedInput
  }

  export type PermissionCreateManyInput = {
    id?: string
    key: string
    name: string
    description?: string | null
  }

  export type PermissionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PermissionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RolePermissionCreateInput = {
    permission: PermissionCreateNestedOneWithoutRolePermissionsInput
    role: RoleCreateNestedOneWithoutRolePermissionsInput
  }

  export type RolePermissionUncheckedCreateInput = {
    roleId: string
    permissionId: string
  }

  export type RolePermissionUpdateInput = {
    permission?: PermissionUpdateOneRequiredWithoutRolePermissionsNestedInput
    role?: RoleUpdateOneRequiredWithoutRolePermissionsNestedInput
  }

  export type RolePermissionUncheckedUpdateInput = {
    roleId?: StringFieldUpdateOperationsInput | string
    permissionId?: StringFieldUpdateOperationsInput | string
  }

  export type RolePermissionCreateManyInput = {
    roleId: string
    permissionId: string
  }

  export type RolePermissionUpdateManyMutationInput = {

  }

  export type RolePermissionUncheckedUpdateManyInput = {
    roleId?: StringFieldUpdateOperationsInput | string
    permissionId?: StringFieldUpdateOperationsInput | string
  }

  export type IntegrationRequestCreateInput = {
    id?: string
    clientName: string
    hostingType: $Enums.HostingType
    fixedIp?: string | null
    database: JsonNullValueInput | InputJsonValue
    scopes: JsonNullValueInput | InputJsonValue
    objective: string
    technicalContact: JsonNullValueInput | InputJsonValue
    responsiblePerson?: JsonNullValueInput | InputJsonValue
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    modules?: IntegrationRequestCreatemodulesInput | string[]
    cnpj?: string | null
    legalName: string
    rejectionReason?: string | null
  }

  export type IntegrationRequestUncheckedCreateInput = {
    id?: string
    clientName: string
    hostingType: $Enums.HostingType
    fixedIp?: string | null
    database: JsonNullValueInput | InputJsonValue
    scopes: JsonNullValueInput | InputJsonValue
    objective: string
    technicalContact: JsonNullValueInput | InputJsonValue
    responsiblePerson?: JsonNullValueInput | InputJsonValue
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    modules?: IntegrationRequestCreatemodulesInput | string[]
    cnpj?: string | null
    legalName: string
    rejectionReason?: string | null
  }

  export type IntegrationRequestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    hostingType?: EnumHostingTypeFieldUpdateOperationsInput | $Enums.HostingType
    fixedIp?: NullableStringFieldUpdateOperationsInput | string | null
    database?: JsonNullValueInput | InputJsonValue
    scopes?: JsonNullValueInput | InputJsonValue
    objective?: StringFieldUpdateOperationsInput | string
    technicalContact?: JsonNullValueInput | InputJsonValue
    responsiblePerson?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    modules?: IntegrationRequestUpdatemodulesInput | string[]
    cnpj?: NullableStringFieldUpdateOperationsInput | string | null
    legalName?: StringFieldUpdateOperationsInput | string
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type IntegrationRequestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    hostingType?: EnumHostingTypeFieldUpdateOperationsInput | $Enums.HostingType
    fixedIp?: NullableStringFieldUpdateOperationsInput | string | null
    database?: JsonNullValueInput | InputJsonValue
    scopes?: JsonNullValueInput | InputJsonValue
    objective?: StringFieldUpdateOperationsInput | string
    technicalContact?: JsonNullValueInput | InputJsonValue
    responsiblePerson?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    modules?: IntegrationRequestUpdatemodulesInput | string[]
    cnpj?: NullableStringFieldUpdateOperationsInput | string | null
    legalName?: StringFieldUpdateOperationsInput | string
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type IntegrationRequestCreateManyInput = {
    id?: string
    clientName: string
    hostingType: $Enums.HostingType
    fixedIp?: string | null
    database: JsonNullValueInput | InputJsonValue
    scopes: JsonNullValueInput | InputJsonValue
    objective: string
    technicalContact: JsonNullValueInput | InputJsonValue
    responsiblePerson?: JsonNullValueInput | InputJsonValue
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    modules?: IntegrationRequestCreatemodulesInput | string[]
    cnpj?: string | null
    legalName: string
    rejectionReason?: string | null
  }

  export type IntegrationRequestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    hostingType?: EnumHostingTypeFieldUpdateOperationsInput | $Enums.HostingType
    fixedIp?: NullableStringFieldUpdateOperationsInput | string | null
    database?: JsonNullValueInput | InputJsonValue
    scopes?: JsonNullValueInput | InputJsonValue
    objective?: StringFieldUpdateOperationsInput | string
    technicalContact?: JsonNullValueInput | InputJsonValue
    responsiblePerson?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    modules?: IntegrationRequestUpdatemodulesInput | string[]
    cnpj?: NullableStringFieldUpdateOperationsInput | string | null
    legalName?: StringFieldUpdateOperationsInput | string
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type IntegrationRequestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    hostingType?: EnumHostingTypeFieldUpdateOperationsInput | $Enums.HostingType
    fixedIp?: NullableStringFieldUpdateOperationsInput | string | null
    database?: JsonNullValueInput | InputJsonValue
    scopes?: JsonNullValueInput | InputJsonValue
    objective?: StringFieldUpdateOperationsInput | string
    technicalContact?: JsonNullValueInput | InputJsonValue
    responsiblePerson?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    modules?: IntegrationRequestUpdatemodulesInput | string[]
    cnpj?: NullableStringFieldUpdateOperationsInput | string | null
    legalName?: StringFieldUpdateOperationsInput | string
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AnnouncementCreateInput = {
    id?: string
    type?: $Enums.AnnouncementType
    text: string
    ctaText?: string | null
    ctaLink?: string | null
    startDate?: Date | string | null
    endDate?: Date | string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    views?: AnnouncementViewCreateNestedManyWithoutAnnouncementInput
    newsletter?: NewsletterCreateNestedOneWithoutAnnouncementsInput
  }

  export type AnnouncementUncheckedCreateInput = {
    id?: string
    type?: $Enums.AnnouncementType
    text: string
    ctaText?: string | null
    ctaLink?: string | null
    startDate?: Date | string | null
    endDate?: Date | string | null
    active?: boolean
    newsletterId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    views?: AnnouncementViewUncheckedCreateNestedManyWithoutAnnouncementInput
  }

  export type AnnouncementUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumAnnouncementTypeFieldUpdateOperationsInput | $Enums.AnnouncementType
    text?: StringFieldUpdateOperationsInput | string
    ctaText?: NullableStringFieldUpdateOperationsInput | string | null
    ctaLink?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    views?: AnnouncementViewUpdateManyWithoutAnnouncementNestedInput
    newsletter?: NewsletterUpdateOneWithoutAnnouncementsNestedInput
  }

  export type AnnouncementUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumAnnouncementTypeFieldUpdateOperationsInput | $Enums.AnnouncementType
    text?: StringFieldUpdateOperationsInput | string
    ctaText?: NullableStringFieldUpdateOperationsInput | string | null
    ctaLink?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    newsletterId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    views?: AnnouncementViewUncheckedUpdateManyWithoutAnnouncementNestedInput
  }

  export type AnnouncementCreateManyInput = {
    id?: string
    type?: $Enums.AnnouncementType
    text: string
    ctaText?: string | null
    ctaLink?: string | null
    startDate?: Date | string | null
    endDate?: Date | string | null
    active?: boolean
    newsletterId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AnnouncementUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumAnnouncementTypeFieldUpdateOperationsInput | $Enums.AnnouncementType
    text?: StringFieldUpdateOperationsInput | string
    ctaText?: NullableStringFieldUpdateOperationsInput | string | null
    ctaLink?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnnouncementUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumAnnouncementTypeFieldUpdateOperationsInput | $Enums.AnnouncementType
    text?: StringFieldUpdateOperationsInput | string
    ctaText?: NullableStringFieldUpdateOperationsInput | string | null
    ctaLink?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    newsletterId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsletterCreateInput = {
    subject: string
    initialMessage?: string | null
    finalMessage?: string | null
    sentAt?: Date | string
    announcements?: AnnouncementCreateNestedManyWithoutNewsletterInput
  }

  export type NewsletterUncheckedCreateInput = {
    id?: number
    subject: string
    initialMessage?: string | null
    finalMessage?: string | null
    sentAt?: Date | string
    announcements?: AnnouncementUncheckedCreateNestedManyWithoutNewsletterInput
  }

  export type NewsletterUpdateInput = {
    subject?: StringFieldUpdateOperationsInput | string
    initialMessage?: NullableStringFieldUpdateOperationsInput | string | null
    finalMessage?: NullableStringFieldUpdateOperationsInput | string | null
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    announcements?: AnnouncementUpdateManyWithoutNewsletterNestedInput
  }

  export type NewsletterUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    subject?: StringFieldUpdateOperationsInput | string
    initialMessage?: NullableStringFieldUpdateOperationsInput | string | null
    finalMessage?: NullableStringFieldUpdateOperationsInput | string | null
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    announcements?: AnnouncementUncheckedUpdateManyWithoutNewsletterNestedInput
  }

  export type NewsletterCreateManyInput = {
    id?: number
    subject: string
    initialMessage?: string | null
    finalMessage?: string | null
    sentAt?: Date | string
  }

  export type NewsletterUpdateManyMutationInput = {
    subject?: StringFieldUpdateOperationsInput | string
    initialMessage?: NullableStringFieldUpdateOperationsInput | string | null
    finalMessage?: NullableStringFieldUpdateOperationsInput | string | null
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsletterUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    subject?: StringFieldUpdateOperationsInput | string
    initialMessage?: NullableStringFieldUpdateOperationsInput | string | null
    finalMessage?: NullableStringFieldUpdateOperationsInput | string | null
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnnouncementViewCreateInput = {
    id?: string
    viewedAt?: Date | string
    announcement: AnnouncementCreateNestedOneWithoutViewsInput
    user: UserCreateNestedOneWithoutAnnouncementViewsInput
  }

  export type AnnouncementViewUncheckedCreateInput = {
    id?: string
    announcementId: string
    userId: string
    viewedAt?: Date | string
  }

  export type AnnouncementViewUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    viewedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    announcement?: AnnouncementUpdateOneRequiredWithoutViewsNestedInput
    user?: UserUpdateOneRequiredWithoutAnnouncementViewsNestedInput
  }

  export type AnnouncementViewUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    announcementId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    viewedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnnouncementViewCreateManyInput = {
    id?: string
    announcementId: string
    userId: string
    viewedAt?: Date | string
  }

  export type AnnouncementViewUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    viewedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnnouncementViewUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    announcementId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    viewedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StatusLogCreateInput = {
    id?: string
    apiStatus: string
    apiLatency: number
    dbStatus: string
    dbLatency: number
    timestamp?: Date | string
  }

  export type StatusLogUncheckedCreateInput = {
    id?: string
    apiStatus: string
    apiLatency: number
    dbStatus: string
    dbLatency: number
    timestamp?: Date | string
  }

  export type StatusLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    apiStatus?: StringFieldUpdateOperationsInput | string
    apiLatency?: IntFieldUpdateOperationsInput | number
    dbStatus?: StringFieldUpdateOperationsInput | string
    dbLatency?: IntFieldUpdateOperationsInput | number
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StatusLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    apiStatus?: StringFieldUpdateOperationsInput | string
    apiLatency?: IntFieldUpdateOperationsInput | number
    dbStatus?: StringFieldUpdateOperationsInput | string
    dbLatency?: IntFieldUpdateOperationsInput | number
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StatusLogCreateManyInput = {
    id?: string
    apiStatus: string
    apiLatency: number
    dbStatus: string
    dbLatency: number
    timestamp?: Date | string
  }

  export type StatusLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    apiStatus?: StringFieldUpdateOperationsInput | string
    apiLatency?: IntFieldUpdateOperationsInput | number
    dbStatus?: StringFieldUpdateOperationsInput | string
    dbLatency?: IntFieldUpdateOperationsInput | number
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StatusLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    apiStatus?: StringFieldUpdateOperationsInput | string
    apiLatency?: IntFieldUpdateOperationsInput | number
    dbStatus?: StringFieldUpdateOperationsInput | string
    dbLatency?: IntFieldUpdateOperationsInput | number
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemHeartbeatCreateInput = {
    id?: string
    service: string
    timestamp?: Date | string
  }

  export type SystemHeartbeatUncheckedCreateInput = {
    id?: string
    service: string
    timestamp?: Date | string
  }

  export type SystemHeartbeatUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    service?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemHeartbeatUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    service?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemHeartbeatCreateManyInput = {
    id?: string
    service: string
    timestamp?: Date | string
  }

  export type SystemHeartbeatUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    service?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemHeartbeatUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    service?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DbCredentialsScalarRelationFilter = {
    is?: DbCredentialsWhereInput
    isNot?: DbCredentialsWhereInput
  }

  export type RoleNullableScalarRelationFilter = {
    is?: RoleWhereInput | null
    isNot?: RoleWhereInput | null
  }

  export type PlanNullableScalarRelationFilter = {
    is?: PlanWhereInput | null
    isNot?: PlanWhereInput | null
  }

  export type UserInvitationNullableScalarRelationFilter = {
    is?: UserInvitationWhereInput | null
    isNot?: UserInvitationWhereInput | null
  }

  export type RequestLogListRelationFilter = {
    every?: RequestLogWhereInput
    some?: RequestLogWhereInput
    none?: RequestLogWhereInput
  }

  export type AnnouncementViewListRelationFilter = {
    every?: AnnouncementViewWhereInput
    some?: AnnouncementViewWhereInput
    none?: AnnouncementViewWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type RequestLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AnnouncementViewOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    user?: SortOrder
    passwordHash?: SortOrder
    status?: SortOrder
    dbCredentialsId?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    storeId?: SortOrder
    roleId?: SortOrder
    planId?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    storeId?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    user?: SortOrder
    passwordHash?: SortOrder
    status?: SortOrder
    dbCredentialsId?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    storeId?: SortOrder
    roleId?: SortOrder
    planId?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    user?: SortOrder
    passwordHash?: SortOrder
    status?: SortOrder
    dbCredentialsId?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    storeId?: SortOrder
    roleId?: SortOrder
    planId?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    storeId?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PlanCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    reqMin?: SortOrder
    reqMonth?: SortOrder
    maxPageSize?: SortOrder
    maxDateRangeDays?: SortOrder
  }

  export type PlanAvgOrderByAggregateInput = {
    reqMin?: SortOrder
    reqMonth?: SortOrder
    maxPageSize?: SortOrder
    maxDateRangeDays?: SortOrder
  }

  export type PlanMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    reqMin?: SortOrder
    reqMonth?: SortOrder
    maxPageSize?: SortOrder
    maxDateRangeDays?: SortOrder
  }

  export type PlanMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    reqMin?: SortOrder
    reqMonth?: SortOrder
    maxPageSize?: SortOrder
    maxDateRangeDays?: SortOrder
  }

  export type PlanSumOrderByAggregateInput = {
    reqMin?: SortOrder
    reqMonth?: SortOrder
    maxPageSize?: SortOrder
    maxDateRangeDays?: SortOrder
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type RequestLogCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    method?: SortOrder
    path?: SortOrder
    status?: SortOrder
    ip?: SortOrder
    durationMs?: SortOrder
    createdAt?: SortOrder
  }

  export type RequestLogAvgOrderByAggregateInput = {
    status?: SortOrder
    durationMs?: SortOrder
  }

  export type RequestLogMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    method?: SortOrder
    path?: SortOrder
    status?: SortOrder
    ip?: SortOrder
    durationMs?: SortOrder
    createdAt?: SortOrder
  }

  export type RequestLogMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    method?: SortOrder
    path?: SortOrder
    status?: SortOrder
    ip?: SortOrder
    durationMs?: SortOrder
    createdAt?: SortOrder
  }

  export type RequestLogSumOrderByAggregateInput = {
    status?: SortOrder
    durationMs?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type UserInvitationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    acceptedAt?: SortOrder
  }

  export type UserInvitationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    acceptedAt?: SortOrder
  }

  export type UserInvitationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    acceptedAt?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DbCredentialsCountOrderByAggregateInput = {
    id?: SortOrder
    host?: SortOrder
    port?: SortOrder
    database?: SortOrder
    user?: SortOrder
    dbId?: SortOrder
  }

  export type DbCredentialsAvgOrderByAggregateInput = {
    port?: SortOrder
    dbId?: SortOrder
  }

  export type DbCredentialsMaxOrderByAggregateInput = {
    id?: SortOrder
    host?: SortOrder
    port?: SortOrder
    database?: SortOrder
    user?: SortOrder
    dbId?: SortOrder
  }

  export type DbCredentialsMinOrderByAggregateInput = {
    id?: SortOrder
    host?: SortOrder
    port?: SortOrder
    database?: SortOrder
    user?: SortOrder
    dbId?: SortOrder
  }

  export type DbCredentialsSumOrderByAggregateInput = {
    port?: SortOrder
    dbId?: SortOrder
  }

  export type RolePermissionListRelationFilter = {
    every?: RolePermissionWhereInput
    some?: RolePermissionWhereInput
    none?: RolePermissionWhereInput
  }

  export type RolePermissionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RoleCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
  }

  export type RoleMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
  }

  export type RoleMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
  }

  export type PermissionCountOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    name?: SortOrder
    description?: SortOrder
  }

  export type PermissionMaxOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    name?: SortOrder
    description?: SortOrder
  }

  export type PermissionMinOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    name?: SortOrder
    description?: SortOrder
  }

  export type PermissionScalarRelationFilter = {
    is?: PermissionWhereInput
    isNot?: PermissionWhereInput
  }

  export type RoleScalarRelationFilter = {
    is?: RoleWhereInput
    isNot?: RoleWhereInput
  }

  export type RolePermissionRoleIdPermissionIdCompoundUniqueInput = {
    roleId: string
    permissionId: string
  }

  export type RolePermissionCountOrderByAggregateInput = {
    roleId?: SortOrder
    permissionId?: SortOrder
  }

  export type RolePermissionMaxOrderByAggregateInput = {
    roleId?: SortOrder
    permissionId?: SortOrder
  }

  export type RolePermissionMinOrderByAggregateInput = {
    roleId?: SortOrder
    permissionId?: SortOrder
  }

  export type EnumHostingTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.HostingType | EnumHostingTypeFieldRefInput<$PrismaModel>
    in?: $Enums.HostingType[] | ListEnumHostingTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.HostingType[] | ListEnumHostingTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumHostingTypeFilter<$PrismaModel> | $Enums.HostingType
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type IntegrationRequestCountOrderByAggregateInput = {
    id?: SortOrder
    clientName?: SortOrder
    hostingType?: SortOrder
    fixedIp?: SortOrder
    database?: SortOrder
    scopes?: SortOrder
    objective?: SortOrder
    technicalContact?: SortOrder
    responsiblePerson?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    modules?: SortOrder
    cnpj?: SortOrder
    legalName?: SortOrder
    rejectionReason?: SortOrder
  }

  export type IntegrationRequestMaxOrderByAggregateInput = {
    id?: SortOrder
    clientName?: SortOrder
    hostingType?: SortOrder
    fixedIp?: SortOrder
    objective?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    cnpj?: SortOrder
    legalName?: SortOrder
    rejectionReason?: SortOrder
  }

  export type IntegrationRequestMinOrderByAggregateInput = {
    id?: SortOrder
    clientName?: SortOrder
    hostingType?: SortOrder
    fixedIp?: SortOrder
    objective?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    cnpj?: SortOrder
    legalName?: SortOrder
    rejectionReason?: SortOrder
  }

  export type EnumHostingTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.HostingType | EnumHostingTypeFieldRefInput<$PrismaModel>
    in?: $Enums.HostingType[] | ListEnumHostingTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.HostingType[] | ListEnumHostingTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumHostingTypeWithAggregatesFilter<$PrismaModel> | $Enums.HostingType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumHostingTypeFilter<$PrismaModel>
    _max?: NestedEnumHostingTypeFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type EnumAnnouncementTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AnnouncementType | EnumAnnouncementTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AnnouncementType[] | ListEnumAnnouncementTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AnnouncementType[] | ListEnumAnnouncementTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAnnouncementTypeFilter<$PrismaModel> | $Enums.AnnouncementType
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NewsletterNullableScalarRelationFilter = {
    is?: NewsletterWhereInput | null
    isNot?: NewsletterWhereInput | null
  }

  export type AnnouncementCountOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    text?: SortOrder
    ctaText?: SortOrder
    ctaLink?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    active?: SortOrder
    newsletterId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AnnouncementAvgOrderByAggregateInput = {
    newsletterId?: SortOrder
  }

  export type AnnouncementMaxOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    text?: SortOrder
    ctaText?: SortOrder
    ctaLink?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    active?: SortOrder
    newsletterId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AnnouncementMinOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    text?: SortOrder
    ctaText?: SortOrder
    ctaLink?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    active?: SortOrder
    newsletterId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AnnouncementSumOrderByAggregateInput = {
    newsletterId?: SortOrder
  }

  export type EnumAnnouncementTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AnnouncementType | EnumAnnouncementTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AnnouncementType[] | ListEnumAnnouncementTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AnnouncementType[] | ListEnumAnnouncementTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAnnouncementTypeWithAggregatesFilter<$PrismaModel> | $Enums.AnnouncementType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAnnouncementTypeFilter<$PrismaModel>
    _max?: NestedEnumAnnouncementTypeFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type AnnouncementListRelationFilter = {
    every?: AnnouncementWhereInput
    some?: AnnouncementWhereInput
    none?: AnnouncementWhereInput
  }

  export type AnnouncementOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NewsletterCountOrderByAggregateInput = {
    id?: SortOrder
    subject?: SortOrder
    initialMessage?: SortOrder
    finalMessage?: SortOrder
    sentAt?: SortOrder
  }

  export type NewsletterAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type NewsletterMaxOrderByAggregateInput = {
    id?: SortOrder
    subject?: SortOrder
    initialMessage?: SortOrder
    finalMessage?: SortOrder
    sentAt?: SortOrder
  }

  export type NewsletterMinOrderByAggregateInput = {
    id?: SortOrder
    subject?: SortOrder
    initialMessage?: SortOrder
    finalMessage?: SortOrder
    sentAt?: SortOrder
  }

  export type NewsletterSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type AnnouncementScalarRelationFilter = {
    is?: AnnouncementWhereInput
    isNot?: AnnouncementWhereInput
  }

  export type AnnouncementViewAnnouncementIdUserIdCompoundUniqueInput = {
    announcementId: string
    userId: string
  }

  export type AnnouncementViewCountOrderByAggregateInput = {
    id?: SortOrder
    announcementId?: SortOrder
    userId?: SortOrder
    viewedAt?: SortOrder
  }

  export type AnnouncementViewMaxOrderByAggregateInput = {
    id?: SortOrder
    announcementId?: SortOrder
    userId?: SortOrder
    viewedAt?: SortOrder
  }

  export type AnnouncementViewMinOrderByAggregateInput = {
    id?: SortOrder
    announcementId?: SortOrder
    userId?: SortOrder
    viewedAt?: SortOrder
  }

  export type StatusLogCountOrderByAggregateInput = {
    id?: SortOrder
    apiStatus?: SortOrder
    apiLatency?: SortOrder
    dbStatus?: SortOrder
    dbLatency?: SortOrder
    timestamp?: SortOrder
  }

  export type StatusLogAvgOrderByAggregateInput = {
    apiLatency?: SortOrder
    dbLatency?: SortOrder
  }

  export type StatusLogMaxOrderByAggregateInput = {
    id?: SortOrder
    apiStatus?: SortOrder
    apiLatency?: SortOrder
    dbStatus?: SortOrder
    dbLatency?: SortOrder
    timestamp?: SortOrder
  }

  export type StatusLogMinOrderByAggregateInput = {
    id?: SortOrder
    apiStatus?: SortOrder
    apiLatency?: SortOrder
    dbStatus?: SortOrder
    dbLatency?: SortOrder
    timestamp?: SortOrder
  }

  export type StatusLogSumOrderByAggregateInput = {
    apiLatency?: SortOrder
    dbLatency?: SortOrder
  }

  export type SystemHeartbeatCountOrderByAggregateInput = {
    id?: SortOrder
    service?: SortOrder
    timestamp?: SortOrder
  }

  export type SystemHeartbeatMaxOrderByAggregateInput = {
    id?: SortOrder
    service?: SortOrder
    timestamp?: SortOrder
  }

  export type SystemHeartbeatMinOrderByAggregateInput = {
    id?: SortOrder
    service?: SortOrder
    timestamp?: SortOrder
  }

  export type DbCredentialsCreateNestedOneWithoutUsersInput = {
    create?: XOR<DbCredentialsCreateWithoutUsersInput, DbCredentialsUncheckedCreateWithoutUsersInput>
    connectOrCreate?: DbCredentialsCreateOrConnectWithoutUsersInput
    connect?: DbCredentialsWhereUniqueInput
  }

  export type RoleCreateNestedOneWithoutUsersInput = {
    create?: XOR<RoleCreateWithoutUsersInput, RoleUncheckedCreateWithoutUsersInput>
    connectOrCreate?: RoleCreateOrConnectWithoutUsersInput
    connect?: RoleWhereUniqueInput
  }

  export type PlanCreateNestedOneWithoutUsersInput = {
    create?: XOR<PlanCreateWithoutUsersInput, PlanUncheckedCreateWithoutUsersInput>
    connectOrCreate?: PlanCreateOrConnectWithoutUsersInput
    connect?: PlanWhereUniqueInput
  }

  export type UserInvitationCreateNestedOneWithoutUserInput = {
    create?: XOR<UserInvitationCreateWithoutUserInput, UserInvitationUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserInvitationCreateOrConnectWithoutUserInput
    connect?: UserInvitationWhereUniqueInput
  }

  export type RequestLogCreateNestedManyWithoutUserInput = {
    create?: XOR<RequestLogCreateWithoutUserInput, RequestLogUncheckedCreateWithoutUserInput> | RequestLogCreateWithoutUserInput[] | RequestLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RequestLogCreateOrConnectWithoutUserInput | RequestLogCreateOrConnectWithoutUserInput[]
    createMany?: RequestLogCreateManyUserInputEnvelope
    connect?: RequestLogWhereUniqueInput | RequestLogWhereUniqueInput[]
  }

  export type AnnouncementViewCreateNestedManyWithoutUserInput = {
    create?: XOR<AnnouncementViewCreateWithoutUserInput, AnnouncementViewUncheckedCreateWithoutUserInput> | AnnouncementViewCreateWithoutUserInput[] | AnnouncementViewUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AnnouncementViewCreateOrConnectWithoutUserInput | AnnouncementViewCreateOrConnectWithoutUserInput[]
    createMany?: AnnouncementViewCreateManyUserInputEnvelope
    connect?: AnnouncementViewWhereUniqueInput | AnnouncementViewWhereUniqueInput[]
  }

  export type UserInvitationUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<UserInvitationCreateWithoutUserInput, UserInvitationUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserInvitationCreateOrConnectWithoutUserInput
    connect?: UserInvitationWhereUniqueInput
  }

  export type RequestLogUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<RequestLogCreateWithoutUserInput, RequestLogUncheckedCreateWithoutUserInput> | RequestLogCreateWithoutUserInput[] | RequestLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RequestLogCreateOrConnectWithoutUserInput | RequestLogCreateOrConnectWithoutUserInput[]
    createMany?: RequestLogCreateManyUserInputEnvelope
    connect?: RequestLogWhereUniqueInput | RequestLogWhereUniqueInput[]
  }

  export type AnnouncementViewUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AnnouncementViewCreateWithoutUserInput, AnnouncementViewUncheckedCreateWithoutUserInput> | AnnouncementViewCreateWithoutUserInput[] | AnnouncementViewUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AnnouncementViewCreateOrConnectWithoutUserInput | AnnouncementViewCreateOrConnectWithoutUserInput[]
    createMany?: AnnouncementViewCreateManyUserInputEnvelope
    connect?: AnnouncementViewWhereUniqueInput | AnnouncementViewWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DbCredentialsUpdateOneRequiredWithoutUsersNestedInput = {
    create?: XOR<DbCredentialsCreateWithoutUsersInput, DbCredentialsUncheckedCreateWithoutUsersInput>
    connectOrCreate?: DbCredentialsCreateOrConnectWithoutUsersInput
    upsert?: DbCredentialsUpsertWithoutUsersInput
    connect?: DbCredentialsWhereUniqueInput
    update?: XOR<XOR<DbCredentialsUpdateToOneWithWhereWithoutUsersInput, DbCredentialsUpdateWithoutUsersInput>, DbCredentialsUncheckedUpdateWithoutUsersInput>
  }

  export type RoleUpdateOneWithoutUsersNestedInput = {
    create?: XOR<RoleCreateWithoutUsersInput, RoleUncheckedCreateWithoutUsersInput>
    connectOrCreate?: RoleCreateOrConnectWithoutUsersInput
    upsert?: RoleUpsertWithoutUsersInput
    disconnect?: RoleWhereInput | boolean
    delete?: RoleWhereInput | boolean
    connect?: RoleWhereUniqueInput
    update?: XOR<XOR<RoleUpdateToOneWithWhereWithoutUsersInput, RoleUpdateWithoutUsersInput>, RoleUncheckedUpdateWithoutUsersInput>
  }

  export type PlanUpdateOneWithoutUsersNestedInput = {
    create?: XOR<PlanCreateWithoutUsersInput, PlanUncheckedCreateWithoutUsersInput>
    connectOrCreate?: PlanCreateOrConnectWithoutUsersInput
    upsert?: PlanUpsertWithoutUsersInput
    disconnect?: PlanWhereInput | boolean
    delete?: PlanWhereInput | boolean
    connect?: PlanWhereUniqueInput
    update?: XOR<XOR<PlanUpdateToOneWithWhereWithoutUsersInput, PlanUpdateWithoutUsersInput>, PlanUncheckedUpdateWithoutUsersInput>
  }

  export type UserInvitationUpdateOneWithoutUserNestedInput = {
    create?: XOR<UserInvitationCreateWithoutUserInput, UserInvitationUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserInvitationCreateOrConnectWithoutUserInput
    upsert?: UserInvitationUpsertWithoutUserInput
    disconnect?: UserInvitationWhereInput | boolean
    delete?: UserInvitationWhereInput | boolean
    connect?: UserInvitationWhereUniqueInput
    update?: XOR<XOR<UserInvitationUpdateToOneWithWhereWithoutUserInput, UserInvitationUpdateWithoutUserInput>, UserInvitationUncheckedUpdateWithoutUserInput>
  }

  export type RequestLogUpdateManyWithoutUserNestedInput = {
    create?: XOR<RequestLogCreateWithoutUserInput, RequestLogUncheckedCreateWithoutUserInput> | RequestLogCreateWithoutUserInput[] | RequestLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RequestLogCreateOrConnectWithoutUserInput | RequestLogCreateOrConnectWithoutUserInput[]
    upsert?: RequestLogUpsertWithWhereUniqueWithoutUserInput | RequestLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: RequestLogCreateManyUserInputEnvelope
    set?: RequestLogWhereUniqueInput | RequestLogWhereUniqueInput[]
    disconnect?: RequestLogWhereUniqueInput | RequestLogWhereUniqueInput[]
    delete?: RequestLogWhereUniqueInput | RequestLogWhereUniqueInput[]
    connect?: RequestLogWhereUniqueInput | RequestLogWhereUniqueInput[]
    update?: RequestLogUpdateWithWhereUniqueWithoutUserInput | RequestLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: RequestLogUpdateManyWithWhereWithoutUserInput | RequestLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: RequestLogScalarWhereInput | RequestLogScalarWhereInput[]
  }

  export type AnnouncementViewUpdateManyWithoutUserNestedInput = {
    create?: XOR<AnnouncementViewCreateWithoutUserInput, AnnouncementViewUncheckedCreateWithoutUserInput> | AnnouncementViewCreateWithoutUserInput[] | AnnouncementViewUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AnnouncementViewCreateOrConnectWithoutUserInput | AnnouncementViewCreateOrConnectWithoutUserInput[]
    upsert?: AnnouncementViewUpsertWithWhereUniqueWithoutUserInput | AnnouncementViewUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AnnouncementViewCreateManyUserInputEnvelope
    set?: AnnouncementViewWhereUniqueInput | AnnouncementViewWhereUniqueInput[]
    disconnect?: AnnouncementViewWhereUniqueInput | AnnouncementViewWhereUniqueInput[]
    delete?: AnnouncementViewWhereUniqueInput | AnnouncementViewWhereUniqueInput[]
    connect?: AnnouncementViewWhereUniqueInput | AnnouncementViewWhereUniqueInput[]
    update?: AnnouncementViewUpdateWithWhereUniqueWithoutUserInput | AnnouncementViewUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AnnouncementViewUpdateManyWithWhereWithoutUserInput | AnnouncementViewUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AnnouncementViewScalarWhereInput | AnnouncementViewScalarWhereInput[]
  }

  export type UserInvitationUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<UserInvitationCreateWithoutUserInput, UserInvitationUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserInvitationCreateOrConnectWithoutUserInput
    upsert?: UserInvitationUpsertWithoutUserInput
    disconnect?: UserInvitationWhereInput | boolean
    delete?: UserInvitationWhereInput | boolean
    connect?: UserInvitationWhereUniqueInput
    update?: XOR<XOR<UserInvitationUpdateToOneWithWhereWithoutUserInput, UserInvitationUpdateWithoutUserInput>, UserInvitationUncheckedUpdateWithoutUserInput>
  }

  export type RequestLogUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<RequestLogCreateWithoutUserInput, RequestLogUncheckedCreateWithoutUserInput> | RequestLogCreateWithoutUserInput[] | RequestLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RequestLogCreateOrConnectWithoutUserInput | RequestLogCreateOrConnectWithoutUserInput[]
    upsert?: RequestLogUpsertWithWhereUniqueWithoutUserInput | RequestLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: RequestLogCreateManyUserInputEnvelope
    set?: RequestLogWhereUniqueInput | RequestLogWhereUniqueInput[]
    disconnect?: RequestLogWhereUniqueInput | RequestLogWhereUniqueInput[]
    delete?: RequestLogWhereUniqueInput | RequestLogWhereUniqueInput[]
    connect?: RequestLogWhereUniqueInput | RequestLogWhereUniqueInput[]
    update?: RequestLogUpdateWithWhereUniqueWithoutUserInput | RequestLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: RequestLogUpdateManyWithWhereWithoutUserInput | RequestLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: RequestLogScalarWhereInput | RequestLogScalarWhereInput[]
  }

  export type AnnouncementViewUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AnnouncementViewCreateWithoutUserInput, AnnouncementViewUncheckedCreateWithoutUserInput> | AnnouncementViewCreateWithoutUserInput[] | AnnouncementViewUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AnnouncementViewCreateOrConnectWithoutUserInput | AnnouncementViewCreateOrConnectWithoutUserInput[]
    upsert?: AnnouncementViewUpsertWithWhereUniqueWithoutUserInput | AnnouncementViewUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AnnouncementViewCreateManyUserInputEnvelope
    set?: AnnouncementViewWhereUniqueInput | AnnouncementViewWhereUniqueInput[]
    disconnect?: AnnouncementViewWhereUniqueInput | AnnouncementViewWhereUniqueInput[]
    delete?: AnnouncementViewWhereUniqueInput | AnnouncementViewWhereUniqueInput[]
    connect?: AnnouncementViewWhereUniqueInput | AnnouncementViewWhereUniqueInput[]
    update?: AnnouncementViewUpdateWithWhereUniqueWithoutUserInput | AnnouncementViewUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AnnouncementViewUpdateManyWithWhereWithoutUserInput | AnnouncementViewUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AnnouncementViewScalarWhereInput | AnnouncementViewScalarWhereInput[]
  }

  export type UserCreateNestedManyWithoutPlanInput = {
    create?: XOR<UserCreateWithoutPlanInput, UserUncheckedCreateWithoutPlanInput> | UserCreateWithoutPlanInput[] | UserUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: UserCreateOrConnectWithoutPlanInput | UserCreateOrConnectWithoutPlanInput[]
    createMany?: UserCreateManyPlanInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutPlanInput = {
    create?: XOR<UserCreateWithoutPlanInput, UserUncheckedCreateWithoutPlanInput> | UserCreateWithoutPlanInput[] | UserUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: UserCreateOrConnectWithoutPlanInput | UserCreateOrConnectWithoutPlanInput[]
    createMany?: UserCreateManyPlanInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type UserUpdateManyWithoutPlanNestedInput = {
    create?: XOR<UserCreateWithoutPlanInput, UserUncheckedCreateWithoutPlanInput> | UserCreateWithoutPlanInput[] | UserUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: UserCreateOrConnectWithoutPlanInput | UserCreateOrConnectWithoutPlanInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutPlanInput | UserUpsertWithWhereUniqueWithoutPlanInput[]
    createMany?: UserCreateManyPlanInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutPlanInput | UserUpdateWithWhereUniqueWithoutPlanInput[]
    updateMany?: UserUpdateManyWithWhereWithoutPlanInput | UserUpdateManyWithWhereWithoutPlanInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutPlanNestedInput = {
    create?: XOR<UserCreateWithoutPlanInput, UserUncheckedCreateWithoutPlanInput> | UserCreateWithoutPlanInput[] | UserUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: UserCreateOrConnectWithoutPlanInput | UserCreateOrConnectWithoutPlanInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutPlanInput | UserUpsertWithWhereUniqueWithoutPlanInput[]
    createMany?: UserCreateManyPlanInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutPlanInput | UserUpdateWithWhereUniqueWithoutPlanInput[]
    updateMany?: UserUpdateManyWithWhereWithoutPlanInput | UserUpdateManyWithWhereWithoutPlanInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutRequestLogsInput = {
    create?: XOR<UserCreateWithoutRequestLogsInput, UserUncheckedCreateWithoutRequestLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutRequestLogsInput
    connect?: UserWhereUniqueInput
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutRequestLogsNestedInput = {
    create?: XOR<UserCreateWithoutRequestLogsInput, UserUncheckedCreateWithoutRequestLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutRequestLogsInput
    upsert?: UserUpsertWithoutRequestLogsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutRequestLogsInput, UserUpdateWithoutRequestLogsInput>, UserUncheckedUpdateWithoutRequestLogsInput>
  }

  export type UserCreateNestedOneWithoutInvitationInput = {
    create?: XOR<UserCreateWithoutInvitationInput, UserUncheckedCreateWithoutInvitationInput>
    connectOrCreate?: UserCreateOrConnectWithoutInvitationInput
    connect?: UserWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneRequiredWithoutInvitationNestedInput = {
    create?: XOR<UserCreateWithoutInvitationInput, UserUncheckedCreateWithoutInvitationInput>
    connectOrCreate?: UserCreateOrConnectWithoutInvitationInput
    upsert?: UserUpsertWithoutInvitationInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutInvitationInput, UserUpdateWithoutInvitationInput>, UserUncheckedUpdateWithoutInvitationInput>
  }

  export type UserCreateNestedManyWithoutDbCredentialsInput = {
    create?: XOR<UserCreateWithoutDbCredentialsInput, UserUncheckedCreateWithoutDbCredentialsInput> | UserCreateWithoutDbCredentialsInput[] | UserUncheckedCreateWithoutDbCredentialsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutDbCredentialsInput | UserCreateOrConnectWithoutDbCredentialsInput[]
    createMany?: UserCreateManyDbCredentialsInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutDbCredentialsInput = {
    create?: XOR<UserCreateWithoutDbCredentialsInput, UserUncheckedCreateWithoutDbCredentialsInput> | UserCreateWithoutDbCredentialsInput[] | UserUncheckedCreateWithoutDbCredentialsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutDbCredentialsInput | UserCreateOrConnectWithoutDbCredentialsInput[]
    createMany?: UserCreateManyDbCredentialsInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type UserUpdateManyWithoutDbCredentialsNestedInput = {
    create?: XOR<UserCreateWithoutDbCredentialsInput, UserUncheckedCreateWithoutDbCredentialsInput> | UserCreateWithoutDbCredentialsInput[] | UserUncheckedCreateWithoutDbCredentialsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutDbCredentialsInput | UserCreateOrConnectWithoutDbCredentialsInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutDbCredentialsInput | UserUpsertWithWhereUniqueWithoutDbCredentialsInput[]
    createMany?: UserCreateManyDbCredentialsInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutDbCredentialsInput | UserUpdateWithWhereUniqueWithoutDbCredentialsInput[]
    updateMany?: UserUpdateManyWithWhereWithoutDbCredentialsInput | UserUpdateManyWithWhereWithoutDbCredentialsInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutDbCredentialsNestedInput = {
    create?: XOR<UserCreateWithoutDbCredentialsInput, UserUncheckedCreateWithoutDbCredentialsInput> | UserCreateWithoutDbCredentialsInput[] | UserUncheckedCreateWithoutDbCredentialsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutDbCredentialsInput | UserCreateOrConnectWithoutDbCredentialsInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutDbCredentialsInput | UserUpsertWithWhereUniqueWithoutDbCredentialsInput[]
    createMany?: UserCreateManyDbCredentialsInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutDbCredentialsInput | UserUpdateWithWhereUniqueWithoutDbCredentialsInput[]
    updateMany?: UserUpdateManyWithWhereWithoutDbCredentialsInput | UserUpdateManyWithWhereWithoutDbCredentialsInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type RolePermissionCreateNestedManyWithoutRoleInput = {
    create?: XOR<RolePermissionCreateWithoutRoleInput, RolePermissionUncheckedCreateWithoutRoleInput> | RolePermissionCreateWithoutRoleInput[] | RolePermissionUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: RolePermissionCreateOrConnectWithoutRoleInput | RolePermissionCreateOrConnectWithoutRoleInput[]
    createMany?: RolePermissionCreateManyRoleInputEnvelope
    connect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
  }

  export type UserCreateNestedManyWithoutRoleInput = {
    create?: XOR<UserCreateWithoutRoleInput, UserUncheckedCreateWithoutRoleInput> | UserCreateWithoutRoleInput[] | UserUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: UserCreateOrConnectWithoutRoleInput | UserCreateOrConnectWithoutRoleInput[]
    createMany?: UserCreateManyRoleInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type RolePermissionUncheckedCreateNestedManyWithoutRoleInput = {
    create?: XOR<RolePermissionCreateWithoutRoleInput, RolePermissionUncheckedCreateWithoutRoleInput> | RolePermissionCreateWithoutRoleInput[] | RolePermissionUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: RolePermissionCreateOrConnectWithoutRoleInput | RolePermissionCreateOrConnectWithoutRoleInput[]
    createMany?: RolePermissionCreateManyRoleInputEnvelope
    connect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutRoleInput = {
    create?: XOR<UserCreateWithoutRoleInput, UserUncheckedCreateWithoutRoleInput> | UserCreateWithoutRoleInput[] | UserUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: UserCreateOrConnectWithoutRoleInput | UserCreateOrConnectWithoutRoleInput[]
    createMany?: UserCreateManyRoleInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type RolePermissionUpdateManyWithoutRoleNestedInput = {
    create?: XOR<RolePermissionCreateWithoutRoleInput, RolePermissionUncheckedCreateWithoutRoleInput> | RolePermissionCreateWithoutRoleInput[] | RolePermissionUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: RolePermissionCreateOrConnectWithoutRoleInput | RolePermissionCreateOrConnectWithoutRoleInput[]
    upsert?: RolePermissionUpsertWithWhereUniqueWithoutRoleInput | RolePermissionUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: RolePermissionCreateManyRoleInputEnvelope
    set?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    disconnect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    delete?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    connect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    update?: RolePermissionUpdateWithWhereUniqueWithoutRoleInput | RolePermissionUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: RolePermissionUpdateManyWithWhereWithoutRoleInput | RolePermissionUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: RolePermissionScalarWhereInput | RolePermissionScalarWhereInput[]
  }

  export type UserUpdateManyWithoutRoleNestedInput = {
    create?: XOR<UserCreateWithoutRoleInput, UserUncheckedCreateWithoutRoleInput> | UserCreateWithoutRoleInput[] | UserUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: UserCreateOrConnectWithoutRoleInput | UserCreateOrConnectWithoutRoleInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutRoleInput | UserUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: UserCreateManyRoleInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutRoleInput | UserUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: UserUpdateManyWithWhereWithoutRoleInput | UserUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type RolePermissionUncheckedUpdateManyWithoutRoleNestedInput = {
    create?: XOR<RolePermissionCreateWithoutRoleInput, RolePermissionUncheckedCreateWithoutRoleInput> | RolePermissionCreateWithoutRoleInput[] | RolePermissionUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: RolePermissionCreateOrConnectWithoutRoleInput | RolePermissionCreateOrConnectWithoutRoleInput[]
    upsert?: RolePermissionUpsertWithWhereUniqueWithoutRoleInput | RolePermissionUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: RolePermissionCreateManyRoleInputEnvelope
    set?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    disconnect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    delete?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    connect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    update?: RolePermissionUpdateWithWhereUniqueWithoutRoleInput | RolePermissionUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: RolePermissionUpdateManyWithWhereWithoutRoleInput | RolePermissionUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: RolePermissionScalarWhereInput | RolePermissionScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutRoleNestedInput = {
    create?: XOR<UserCreateWithoutRoleInput, UserUncheckedCreateWithoutRoleInput> | UserCreateWithoutRoleInput[] | UserUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: UserCreateOrConnectWithoutRoleInput | UserCreateOrConnectWithoutRoleInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutRoleInput | UserUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: UserCreateManyRoleInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutRoleInput | UserUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: UserUpdateManyWithWhereWithoutRoleInput | UserUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type RolePermissionCreateNestedManyWithoutPermissionInput = {
    create?: XOR<RolePermissionCreateWithoutPermissionInput, RolePermissionUncheckedCreateWithoutPermissionInput> | RolePermissionCreateWithoutPermissionInput[] | RolePermissionUncheckedCreateWithoutPermissionInput[]
    connectOrCreate?: RolePermissionCreateOrConnectWithoutPermissionInput | RolePermissionCreateOrConnectWithoutPermissionInput[]
    createMany?: RolePermissionCreateManyPermissionInputEnvelope
    connect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
  }

  export type RolePermissionUncheckedCreateNestedManyWithoutPermissionInput = {
    create?: XOR<RolePermissionCreateWithoutPermissionInput, RolePermissionUncheckedCreateWithoutPermissionInput> | RolePermissionCreateWithoutPermissionInput[] | RolePermissionUncheckedCreateWithoutPermissionInput[]
    connectOrCreate?: RolePermissionCreateOrConnectWithoutPermissionInput | RolePermissionCreateOrConnectWithoutPermissionInput[]
    createMany?: RolePermissionCreateManyPermissionInputEnvelope
    connect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
  }

  export type RolePermissionUpdateManyWithoutPermissionNestedInput = {
    create?: XOR<RolePermissionCreateWithoutPermissionInput, RolePermissionUncheckedCreateWithoutPermissionInput> | RolePermissionCreateWithoutPermissionInput[] | RolePermissionUncheckedCreateWithoutPermissionInput[]
    connectOrCreate?: RolePermissionCreateOrConnectWithoutPermissionInput | RolePermissionCreateOrConnectWithoutPermissionInput[]
    upsert?: RolePermissionUpsertWithWhereUniqueWithoutPermissionInput | RolePermissionUpsertWithWhereUniqueWithoutPermissionInput[]
    createMany?: RolePermissionCreateManyPermissionInputEnvelope
    set?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    disconnect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    delete?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    connect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    update?: RolePermissionUpdateWithWhereUniqueWithoutPermissionInput | RolePermissionUpdateWithWhereUniqueWithoutPermissionInput[]
    updateMany?: RolePermissionUpdateManyWithWhereWithoutPermissionInput | RolePermissionUpdateManyWithWhereWithoutPermissionInput[]
    deleteMany?: RolePermissionScalarWhereInput | RolePermissionScalarWhereInput[]
  }

  export type RolePermissionUncheckedUpdateManyWithoutPermissionNestedInput = {
    create?: XOR<RolePermissionCreateWithoutPermissionInput, RolePermissionUncheckedCreateWithoutPermissionInput> | RolePermissionCreateWithoutPermissionInput[] | RolePermissionUncheckedCreateWithoutPermissionInput[]
    connectOrCreate?: RolePermissionCreateOrConnectWithoutPermissionInput | RolePermissionCreateOrConnectWithoutPermissionInput[]
    upsert?: RolePermissionUpsertWithWhereUniqueWithoutPermissionInput | RolePermissionUpsertWithWhereUniqueWithoutPermissionInput[]
    createMany?: RolePermissionCreateManyPermissionInputEnvelope
    set?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    disconnect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    delete?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    connect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    update?: RolePermissionUpdateWithWhereUniqueWithoutPermissionInput | RolePermissionUpdateWithWhereUniqueWithoutPermissionInput[]
    updateMany?: RolePermissionUpdateManyWithWhereWithoutPermissionInput | RolePermissionUpdateManyWithWhereWithoutPermissionInput[]
    deleteMany?: RolePermissionScalarWhereInput | RolePermissionScalarWhereInput[]
  }

  export type PermissionCreateNestedOneWithoutRolePermissionsInput = {
    create?: XOR<PermissionCreateWithoutRolePermissionsInput, PermissionUncheckedCreateWithoutRolePermissionsInput>
    connectOrCreate?: PermissionCreateOrConnectWithoutRolePermissionsInput
    connect?: PermissionWhereUniqueInput
  }

  export type RoleCreateNestedOneWithoutRolePermissionsInput = {
    create?: XOR<RoleCreateWithoutRolePermissionsInput, RoleUncheckedCreateWithoutRolePermissionsInput>
    connectOrCreate?: RoleCreateOrConnectWithoutRolePermissionsInput
    connect?: RoleWhereUniqueInput
  }

  export type PermissionUpdateOneRequiredWithoutRolePermissionsNestedInput = {
    create?: XOR<PermissionCreateWithoutRolePermissionsInput, PermissionUncheckedCreateWithoutRolePermissionsInput>
    connectOrCreate?: PermissionCreateOrConnectWithoutRolePermissionsInput
    upsert?: PermissionUpsertWithoutRolePermissionsInput
    connect?: PermissionWhereUniqueInput
    update?: XOR<XOR<PermissionUpdateToOneWithWhereWithoutRolePermissionsInput, PermissionUpdateWithoutRolePermissionsInput>, PermissionUncheckedUpdateWithoutRolePermissionsInput>
  }

  export type RoleUpdateOneRequiredWithoutRolePermissionsNestedInput = {
    create?: XOR<RoleCreateWithoutRolePermissionsInput, RoleUncheckedCreateWithoutRolePermissionsInput>
    connectOrCreate?: RoleCreateOrConnectWithoutRolePermissionsInput
    upsert?: RoleUpsertWithoutRolePermissionsInput
    connect?: RoleWhereUniqueInput
    update?: XOR<XOR<RoleUpdateToOneWithWhereWithoutRolePermissionsInput, RoleUpdateWithoutRolePermissionsInput>, RoleUncheckedUpdateWithoutRolePermissionsInput>
  }

  export type IntegrationRequestCreatemodulesInput = {
    set: string[]
  }

  export type EnumHostingTypeFieldUpdateOperationsInput = {
    set?: $Enums.HostingType
  }

  export type IntegrationRequestUpdatemodulesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type AnnouncementViewCreateNestedManyWithoutAnnouncementInput = {
    create?: XOR<AnnouncementViewCreateWithoutAnnouncementInput, AnnouncementViewUncheckedCreateWithoutAnnouncementInput> | AnnouncementViewCreateWithoutAnnouncementInput[] | AnnouncementViewUncheckedCreateWithoutAnnouncementInput[]
    connectOrCreate?: AnnouncementViewCreateOrConnectWithoutAnnouncementInput | AnnouncementViewCreateOrConnectWithoutAnnouncementInput[]
    createMany?: AnnouncementViewCreateManyAnnouncementInputEnvelope
    connect?: AnnouncementViewWhereUniqueInput | AnnouncementViewWhereUniqueInput[]
  }

  export type NewsletterCreateNestedOneWithoutAnnouncementsInput = {
    create?: XOR<NewsletterCreateWithoutAnnouncementsInput, NewsletterUncheckedCreateWithoutAnnouncementsInput>
    connectOrCreate?: NewsletterCreateOrConnectWithoutAnnouncementsInput
    connect?: NewsletterWhereUniqueInput
  }

  export type AnnouncementViewUncheckedCreateNestedManyWithoutAnnouncementInput = {
    create?: XOR<AnnouncementViewCreateWithoutAnnouncementInput, AnnouncementViewUncheckedCreateWithoutAnnouncementInput> | AnnouncementViewCreateWithoutAnnouncementInput[] | AnnouncementViewUncheckedCreateWithoutAnnouncementInput[]
    connectOrCreate?: AnnouncementViewCreateOrConnectWithoutAnnouncementInput | AnnouncementViewCreateOrConnectWithoutAnnouncementInput[]
    createMany?: AnnouncementViewCreateManyAnnouncementInputEnvelope
    connect?: AnnouncementViewWhereUniqueInput | AnnouncementViewWhereUniqueInput[]
  }

  export type EnumAnnouncementTypeFieldUpdateOperationsInput = {
    set?: $Enums.AnnouncementType
  }

  export type AnnouncementViewUpdateManyWithoutAnnouncementNestedInput = {
    create?: XOR<AnnouncementViewCreateWithoutAnnouncementInput, AnnouncementViewUncheckedCreateWithoutAnnouncementInput> | AnnouncementViewCreateWithoutAnnouncementInput[] | AnnouncementViewUncheckedCreateWithoutAnnouncementInput[]
    connectOrCreate?: AnnouncementViewCreateOrConnectWithoutAnnouncementInput | AnnouncementViewCreateOrConnectWithoutAnnouncementInput[]
    upsert?: AnnouncementViewUpsertWithWhereUniqueWithoutAnnouncementInput | AnnouncementViewUpsertWithWhereUniqueWithoutAnnouncementInput[]
    createMany?: AnnouncementViewCreateManyAnnouncementInputEnvelope
    set?: AnnouncementViewWhereUniqueInput | AnnouncementViewWhereUniqueInput[]
    disconnect?: AnnouncementViewWhereUniqueInput | AnnouncementViewWhereUniqueInput[]
    delete?: AnnouncementViewWhereUniqueInput | AnnouncementViewWhereUniqueInput[]
    connect?: AnnouncementViewWhereUniqueInput | AnnouncementViewWhereUniqueInput[]
    update?: AnnouncementViewUpdateWithWhereUniqueWithoutAnnouncementInput | AnnouncementViewUpdateWithWhereUniqueWithoutAnnouncementInput[]
    updateMany?: AnnouncementViewUpdateManyWithWhereWithoutAnnouncementInput | AnnouncementViewUpdateManyWithWhereWithoutAnnouncementInput[]
    deleteMany?: AnnouncementViewScalarWhereInput | AnnouncementViewScalarWhereInput[]
  }

  export type NewsletterUpdateOneWithoutAnnouncementsNestedInput = {
    create?: XOR<NewsletterCreateWithoutAnnouncementsInput, NewsletterUncheckedCreateWithoutAnnouncementsInput>
    connectOrCreate?: NewsletterCreateOrConnectWithoutAnnouncementsInput
    upsert?: NewsletterUpsertWithoutAnnouncementsInput
    disconnect?: NewsletterWhereInput | boolean
    delete?: NewsletterWhereInput | boolean
    connect?: NewsletterWhereUniqueInput
    update?: XOR<XOR<NewsletterUpdateToOneWithWhereWithoutAnnouncementsInput, NewsletterUpdateWithoutAnnouncementsInput>, NewsletterUncheckedUpdateWithoutAnnouncementsInput>
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type AnnouncementViewUncheckedUpdateManyWithoutAnnouncementNestedInput = {
    create?: XOR<AnnouncementViewCreateWithoutAnnouncementInput, AnnouncementViewUncheckedCreateWithoutAnnouncementInput> | AnnouncementViewCreateWithoutAnnouncementInput[] | AnnouncementViewUncheckedCreateWithoutAnnouncementInput[]
    connectOrCreate?: AnnouncementViewCreateOrConnectWithoutAnnouncementInput | AnnouncementViewCreateOrConnectWithoutAnnouncementInput[]
    upsert?: AnnouncementViewUpsertWithWhereUniqueWithoutAnnouncementInput | AnnouncementViewUpsertWithWhereUniqueWithoutAnnouncementInput[]
    createMany?: AnnouncementViewCreateManyAnnouncementInputEnvelope
    set?: AnnouncementViewWhereUniqueInput | AnnouncementViewWhereUniqueInput[]
    disconnect?: AnnouncementViewWhereUniqueInput | AnnouncementViewWhereUniqueInput[]
    delete?: AnnouncementViewWhereUniqueInput | AnnouncementViewWhereUniqueInput[]
    connect?: AnnouncementViewWhereUniqueInput | AnnouncementViewWhereUniqueInput[]
    update?: AnnouncementViewUpdateWithWhereUniqueWithoutAnnouncementInput | AnnouncementViewUpdateWithWhereUniqueWithoutAnnouncementInput[]
    updateMany?: AnnouncementViewUpdateManyWithWhereWithoutAnnouncementInput | AnnouncementViewUpdateManyWithWhereWithoutAnnouncementInput[]
    deleteMany?: AnnouncementViewScalarWhereInput | AnnouncementViewScalarWhereInput[]
  }

  export type AnnouncementCreateNestedManyWithoutNewsletterInput = {
    create?: XOR<AnnouncementCreateWithoutNewsletterInput, AnnouncementUncheckedCreateWithoutNewsletterInput> | AnnouncementCreateWithoutNewsletterInput[] | AnnouncementUncheckedCreateWithoutNewsletterInput[]
    connectOrCreate?: AnnouncementCreateOrConnectWithoutNewsletterInput | AnnouncementCreateOrConnectWithoutNewsletterInput[]
    createMany?: AnnouncementCreateManyNewsletterInputEnvelope
    connect?: AnnouncementWhereUniqueInput | AnnouncementWhereUniqueInput[]
  }

  export type AnnouncementUncheckedCreateNestedManyWithoutNewsletterInput = {
    create?: XOR<AnnouncementCreateWithoutNewsletterInput, AnnouncementUncheckedCreateWithoutNewsletterInput> | AnnouncementCreateWithoutNewsletterInput[] | AnnouncementUncheckedCreateWithoutNewsletterInput[]
    connectOrCreate?: AnnouncementCreateOrConnectWithoutNewsletterInput | AnnouncementCreateOrConnectWithoutNewsletterInput[]
    createMany?: AnnouncementCreateManyNewsletterInputEnvelope
    connect?: AnnouncementWhereUniqueInput | AnnouncementWhereUniqueInput[]
  }

  export type AnnouncementUpdateManyWithoutNewsletterNestedInput = {
    create?: XOR<AnnouncementCreateWithoutNewsletterInput, AnnouncementUncheckedCreateWithoutNewsletterInput> | AnnouncementCreateWithoutNewsletterInput[] | AnnouncementUncheckedCreateWithoutNewsletterInput[]
    connectOrCreate?: AnnouncementCreateOrConnectWithoutNewsletterInput | AnnouncementCreateOrConnectWithoutNewsletterInput[]
    upsert?: AnnouncementUpsertWithWhereUniqueWithoutNewsletterInput | AnnouncementUpsertWithWhereUniqueWithoutNewsletterInput[]
    createMany?: AnnouncementCreateManyNewsletterInputEnvelope
    set?: AnnouncementWhereUniqueInput | AnnouncementWhereUniqueInput[]
    disconnect?: AnnouncementWhereUniqueInput | AnnouncementWhereUniqueInput[]
    delete?: AnnouncementWhereUniqueInput | AnnouncementWhereUniqueInput[]
    connect?: AnnouncementWhereUniqueInput | AnnouncementWhereUniqueInput[]
    update?: AnnouncementUpdateWithWhereUniqueWithoutNewsletterInput | AnnouncementUpdateWithWhereUniqueWithoutNewsletterInput[]
    updateMany?: AnnouncementUpdateManyWithWhereWithoutNewsletterInput | AnnouncementUpdateManyWithWhereWithoutNewsletterInput[]
    deleteMany?: AnnouncementScalarWhereInput | AnnouncementScalarWhereInput[]
  }

  export type AnnouncementUncheckedUpdateManyWithoutNewsletterNestedInput = {
    create?: XOR<AnnouncementCreateWithoutNewsletterInput, AnnouncementUncheckedCreateWithoutNewsletterInput> | AnnouncementCreateWithoutNewsletterInput[] | AnnouncementUncheckedCreateWithoutNewsletterInput[]
    connectOrCreate?: AnnouncementCreateOrConnectWithoutNewsletterInput | AnnouncementCreateOrConnectWithoutNewsletterInput[]
    upsert?: AnnouncementUpsertWithWhereUniqueWithoutNewsletterInput | AnnouncementUpsertWithWhereUniqueWithoutNewsletterInput[]
    createMany?: AnnouncementCreateManyNewsletterInputEnvelope
    set?: AnnouncementWhereUniqueInput | AnnouncementWhereUniqueInput[]
    disconnect?: AnnouncementWhereUniqueInput | AnnouncementWhereUniqueInput[]
    delete?: AnnouncementWhereUniqueInput | AnnouncementWhereUniqueInput[]
    connect?: AnnouncementWhereUniqueInput | AnnouncementWhereUniqueInput[]
    update?: AnnouncementUpdateWithWhereUniqueWithoutNewsletterInput | AnnouncementUpdateWithWhereUniqueWithoutNewsletterInput[]
    updateMany?: AnnouncementUpdateManyWithWhereWithoutNewsletterInput | AnnouncementUpdateManyWithWhereWithoutNewsletterInput[]
    deleteMany?: AnnouncementScalarWhereInput | AnnouncementScalarWhereInput[]
  }

  export type AnnouncementCreateNestedOneWithoutViewsInput = {
    create?: XOR<AnnouncementCreateWithoutViewsInput, AnnouncementUncheckedCreateWithoutViewsInput>
    connectOrCreate?: AnnouncementCreateOrConnectWithoutViewsInput
    connect?: AnnouncementWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutAnnouncementViewsInput = {
    create?: XOR<UserCreateWithoutAnnouncementViewsInput, UserUncheckedCreateWithoutAnnouncementViewsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAnnouncementViewsInput
    connect?: UserWhereUniqueInput
  }

  export type AnnouncementUpdateOneRequiredWithoutViewsNestedInput = {
    create?: XOR<AnnouncementCreateWithoutViewsInput, AnnouncementUncheckedCreateWithoutViewsInput>
    connectOrCreate?: AnnouncementCreateOrConnectWithoutViewsInput
    upsert?: AnnouncementUpsertWithoutViewsInput
    connect?: AnnouncementWhereUniqueInput
    update?: XOR<XOR<AnnouncementUpdateToOneWithWhereWithoutViewsInput, AnnouncementUpdateWithoutViewsInput>, AnnouncementUncheckedUpdateWithoutViewsInput>
  }

  export type UserUpdateOneRequiredWithoutAnnouncementViewsNestedInput = {
    create?: XOR<UserCreateWithoutAnnouncementViewsInput, UserUncheckedCreateWithoutAnnouncementViewsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAnnouncementViewsInput
    upsert?: UserUpsertWithoutAnnouncementViewsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAnnouncementViewsInput, UserUpdateWithoutAnnouncementViewsInput>, UserUncheckedUpdateWithoutAnnouncementViewsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumHostingTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.HostingType | EnumHostingTypeFieldRefInput<$PrismaModel>
    in?: $Enums.HostingType[] | ListEnumHostingTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.HostingType[] | ListEnumHostingTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumHostingTypeFilter<$PrismaModel> | $Enums.HostingType
  }

  export type NestedEnumHostingTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.HostingType | EnumHostingTypeFieldRefInput<$PrismaModel>
    in?: $Enums.HostingType[] | ListEnumHostingTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.HostingType[] | ListEnumHostingTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumHostingTypeWithAggregatesFilter<$PrismaModel> | $Enums.HostingType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumHostingTypeFilter<$PrismaModel>
    _max?: NestedEnumHostingTypeFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumAnnouncementTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AnnouncementType | EnumAnnouncementTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AnnouncementType[] | ListEnumAnnouncementTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AnnouncementType[] | ListEnumAnnouncementTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAnnouncementTypeFilter<$PrismaModel> | $Enums.AnnouncementType
  }

  export type NestedEnumAnnouncementTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AnnouncementType | EnumAnnouncementTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AnnouncementType[] | ListEnumAnnouncementTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AnnouncementType[] | ListEnumAnnouncementTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAnnouncementTypeWithAggregatesFilter<$PrismaModel> | $Enums.AnnouncementType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAnnouncementTypeFilter<$PrismaModel>
    _max?: NestedEnumAnnouncementTypeFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type DbCredentialsCreateWithoutUsersInput = {
    id?: string
    host: string
    port: number
    database: string
    user: string
    dbId: number
  }

  export type DbCredentialsUncheckedCreateWithoutUsersInput = {
    id?: string
    host: string
    port: number
    database: string
    user: string
    dbId: number
  }

  export type DbCredentialsCreateOrConnectWithoutUsersInput = {
    where: DbCredentialsWhereUniqueInput
    create: XOR<DbCredentialsCreateWithoutUsersInput, DbCredentialsUncheckedCreateWithoutUsersInput>
  }

  export type RoleCreateWithoutUsersInput = {
    id?: string
    name: string
    description?: string | null
    rolePermissions?: RolePermissionCreateNestedManyWithoutRoleInput
  }

  export type RoleUncheckedCreateWithoutUsersInput = {
    id?: string
    name: string
    description?: string | null
    rolePermissions?: RolePermissionUncheckedCreateNestedManyWithoutRoleInput
  }

  export type RoleCreateOrConnectWithoutUsersInput = {
    where: RoleWhereUniqueInput
    create: XOR<RoleCreateWithoutUsersInput, RoleUncheckedCreateWithoutUsersInput>
  }

  export type PlanCreateWithoutUsersInput = {
    id?: string
    name: string
    reqMin: number
    reqMonth: number
    maxPageSize: number
    maxDateRangeDays: number
  }

  export type PlanUncheckedCreateWithoutUsersInput = {
    id?: string
    name: string
    reqMin: number
    reqMonth: number
    maxPageSize: number
    maxDateRangeDays: number
  }

  export type PlanCreateOrConnectWithoutUsersInput = {
    where: PlanWhereUniqueInput
    create: XOR<PlanCreateWithoutUsersInput, PlanUncheckedCreateWithoutUsersInput>
  }

  export type UserInvitationCreateWithoutUserInput = {
    id?: string
    token: string
    createdAt?: Date | string
    expiresAt: Date | string
    acceptedAt?: Date | string | null
  }

  export type UserInvitationUncheckedCreateWithoutUserInput = {
    id?: string
    token: string
    createdAt?: Date | string
    expiresAt: Date | string
    acceptedAt?: Date | string | null
  }

  export type UserInvitationCreateOrConnectWithoutUserInput = {
    where: UserInvitationWhereUniqueInput
    create: XOR<UserInvitationCreateWithoutUserInput, UserInvitationUncheckedCreateWithoutUserInput>
  }

  export type RequestLogCreateWithoutUserInput = {
    id?: string
    method: string
    path: string
    status: number
    ip?: string | null
    durationMs?: number | null
    createdAt?: Date | string
  }

  export type RequestLogUncheckedCreateWithoutUserInput = {
    id?: string
    method: string
    path: string
    status: number
    ip?: string | null
    durationMs?: number | null
    createdAt?: Date | string
  }

  export type RequestLogCreateOrConnectWithoutUserInput = {
    where: RequestLogWhereUniqueInput
    create: XOR<RequestLogCreateWithoutUserInput, RequestLogUncheckedCreateWithoutUserInput>
  }

  export type RequestLogCreateManyUserInputEnvelope = {
    data: RequestLogCreateManyUserInput | RequestLogCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AnnouncementViewCreateWithoutUserInput = {
    id?: string
    viewedAt?: Date | string
    announcement: AnnouncementCreateNestedOneWithoutViewsInput
  }

  export type AnnouncementViewUncheckedCreateWithoutUserInput = {
    id?: string
    announcementId: string
    viewedAt?: Date | string
  }

  export type AnnouncementViewCreateOrConnectWithoutUserInput = {
    where: AnnouncementViewWhereUniqueInput
    create: XOR<AnnouncementViewCreateWithoutUserInput, AnnouncementViewUncheckedCreateWithoutUserInput>
  }

  export type AnnouncementViewCreateManyUserInputEnvelope = {
    data: AnnouncementViewCreateManyUserInput | AnnouncementViewCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type DbCredentialsUpsertWithoutUsersInput = {
    update: XOR<DbCredentialsUpdateWithoutUsersInput, DbCredentialsUncheckedUpdateWithoutUsersInput>
    create: XOR<DbCredentialsCreateWithoutUsersInput, DbCredentialsUncheckedCreateWithoutUsersInput>
    where?: DbCredentialsWhereInput
  }

  export type DbCredentialsUpdateToOneWithWhereWithoutUsersInput = {
    where?: DbCredentialsWhereInput
    data: XOR<DbCredentialsUpdateWithoutUsersInput, DbCredentialsUncheckedUpdateWithoutUsersInput>
  }

  export type DbCredentialsUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    database?: StringFieldUpdateOperationsInput | string
    user?: StringFieldUpdateOperationsInput | string
    dbId?: IntFieldUpdateOperationsInput | number
  }

  export type DbCredentialsUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    database?: StringFieldUpdateOperationsInput | string
    user?: StringFieldUpdateOperationsInput | string
    dbId?: IntFieldUpdateOperationsInput | number
  }

  export type RoleUpsertWithoutUsersInput = {
    update: XOR<RoleUpdateWithoutUsersInput, RoleUncheckedUpdateWithoutUsersInput>
    create: XOR<RoleCreateWithoutUsersInput, RoleUncheckedCreateWithoutUsersInput>
    where?: RoleWhereInput
  }

  export type RoleUpdateToOneWithWhereWithoutUsersInput = {
    where?: RoleWhereInput
    data: XOR<RoleUpdateWithoutUsersInput, RoleUncheckedUpdateWithoutUsersInput>
  }

  export type RoleUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    rolePermissions?: RolePermissionUpdateManyWithoutRoleNestedInput
  }

  export type RoleUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    rolePermissions?: RolePermissionUncheckedUpdateManyWithoutRoleNestedInput
  }

  export type PlanUpsertWithoutUsersInput = {
    update: XOR<PlanUpdateWithoutUsersInput, PlanUncheckedUpdateWithoutUsersInput>
    create: XOR<PlanCreateWithoutUsersInput, PlanUncheckedCreateWithoutUsersInput>
    where?: PlanWhereInput
  }

  export type PlanUpdateToOneWithWhereWithoutUsersInput = {
    where?: PlanWhereInput
    data: XOR<PlanUpdateWithoutUsersInput, PlanUncheckedUpdateWithoutUsersInput>
  }

  export type PlanUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    reqMin?: IntFieldUpdateOperationsInput | number
    reqMonth?: IntFieldUpdateOperationsInput | number
    maxPageSize?: IntFieldUpdateOperationsInput | number
    maxDateRangeDays?: IntFieldUpdateOperationsInput | number
  }

  export type PlanUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    reqMin?: IntFieldUpdateOperationsInput | number
    reqMonth?: IntFieldUpdateOperationsInput | number
    maxPageSize?: IntFieldUpdateOperationsInput | number
    maxDateRangeDays?: IntFieldUpdateOperationsInput | number
  }

  export type UserInvitationUpsertWithoutUserInput = {
    update: XOR<UserInvitationUpdateWithoutUserInput, UserInvitationUncheckedUpdateWithoutUserInput>
    create: XOR<UserInvitationCreateWithoutUserInput, UserInvitationUncheckedCreateWithoutUserInput>
    where?: UserInvitationWhereInput
  }

  export type UserInvitationUpdateToOneWithWhereWithoutUserInput = {
    where?: UserInvitationWhereInput
    data: XOR<UserInvitationUpdateWithoutUserInput, UserInvitationUncheckedUpdateWithoutUserInput>
  }

  export type UserInvitationUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    acceptedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserInvitationUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    acceptedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RequestLogUpsertWithWhereUniqueWithoutUserInput = {
    where: RequestLogWhereUniqueInput
    update: XOR<RequestLogUpdateWithoutUserInput, RequestLogUncheckedUpdateWithoutUserInput>
    create: XOR<RequestLogCreateWithoutUserInput, RequestLogUncheckedCreateWithoutUserInput>
  }

  export type RequestLogUpdateWithWhereUniqueWithoutUserInput = {
    where: RequestLogWhereUniqueInput
    data: XOR<RequestLogUpdateWithoutUserInput, RequestLogUncheckedUpdateWithoutUserInput>
  }

  export type RequestLogUpdateManyWithWhereWithoutUserInput = {
    where: RequestLogScalarWhereInput
    data: XOR<RequestLogUpdateManyMutationInput, RequestLogUncheckedUpdateManyWithoutUserInput>
  }

  export type RequestLogScalarWhereInput = {
    AND?: RequestLogScalarWhereInput | RequestLogScalarWhereInput[]
    OR?: RequestLogScalarWhereInput[]
    NOT?: RequestLogScalarWhereInput | RequestLogScalarWhereInput[]
    id?: StringFilter<"RequestLog"> | string
    userId?: StringFilter<"RequestLog"> | string
    method?: StringFilter<"RequestLog"> | string
    path?: StringFilter<"RequestLog"> | string
    status?: IntFilter<"RequestLog"> | number
    ip?: StringNullableFilter<"RequestLog"> | string | null
    durationMs?: FloatNullableFilter<"RequestLog"> | number | null
    createdAt?: DateTimeFilter<"RequestLog"> | Date | string
  }

  export type AnnouncementViewUpsertWithWhereUniqueWithoutUserInput = {
    where: AnnouncementViewWhereUniqueInput
    update: XOR<AnnouncementViewUpdateWithoutUserInput, AnnouncementViewUncheckedUpdateWithoutUserInput>
    create: XOR<AnnouncementViewCreateWithoutUserInput, AnnouncementViewUncheckedCreateWithoutUserInput>
  }

  export type AnnouncementViewUpdateWithWhereUniqueWithoutUserInput = {
    where: AnnouncementViewWhereUniqueInput
    data: XOR<AnnouncementViewUpdateWithoutUserInput, AnnouncementViewUncheckedUpdateWithoutUserInput>
  }

  export type AnnouncementViewUpdateManyWithWhereWithoutUserInput = {
    where: AnnouncementViewScalarWhereInput
    data: XOR<AnnouncementViewUpdateManyMutationInput, AnnouncementViewUncheckedUpdateManyWithoutUserInput>
  }

  export type AnnouncementViewScalarWhereInput = {
    AND?: AnnouncementViewScalarWhereInput | AnnouncementViewScalarWhereInput[]
    OR?: AnnouncementViewScalarWhereInput[]
    NOT?: AnnouncementViewScalarWhereInput | AnnouncementViewScalarWhereInput[]
    id?: StringFilter<"AnnouncementView"> | string
    announcementId?: StringFilter<"AnnouncementView"> | string
    userId?: StringFilter<"AnnouncementView"> | string
    viewedAt?: DateTimeFilter<"AnnouncementView"> | Date | string
  }

  export type UserCreateWithoutPlanInput = {
    id?: string
    user: string
    passwordHash: string
    status?: boolean
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    storeId?: number
    dbCredentials: DbCredentialsCreateNestedOneWithoutUsersInput
    role?: RoleCreateNestedOneWithoutUsersInput
    invitation?: UserInvitationCreateNestedOneWithoutUserInput
    requestLogs?: RequestLogCreateNestedManyWithoutUserInput
    announcementViews?: AnnouncementViewCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPlanInput = {
    id?: string
    user: string
    passwordHash: string
    status?: boolean
    dbCredentialsId: string
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    storeId?: number
    roleId?: string | null
    invitation?: UserInvitationUncheckedCreateNestedOneWithoutUserInput
    requestLogs?: RequestLogUncheckedCreateNestedManyWithoutUserInput
    announcementViews?: AnnouncementViewUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPlanInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPlanInput, UserUncheckedCreateWithoutPlanInput>
  }

  export type UserCreateManyPlanInputEnvelope = {
    data: UserCreateManyPlanInput | UserCreateManyPlanInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithWhereUniqueWithoutPlanInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutPlanInput, UserUncheckedUpdateWithoutPlanInput>
    create: XOR<UserCreateWithoutPlanInput, UserUncheckedCreateWithoutPlanInput>
  }

  export type UserUpdateWithWhereUniqueWithoutPlanInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutPlanInput, UserUncheckedUpdateWithoutPlanInput>
  }

  export type UserUpdateManyWithWhereWithoutPlanInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutPlanInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: StringFilter<"User"> | string
    user?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    status?: BoolFilter<"User"> | boolean
    dbCredentialsId?: StringFilter<"User"> | string
    email?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    storeId?: IntFilter<"User"> | number
    roleId?: StringNullableFilter<"User"> | string | null
    planId?: StringNullableFilter<"User"> | string | null
  }

  export type UserCreateWithoutRequestLogsInput = {
    id?: string
    user: string
    passwordHash: string
    status?: boolean
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    storeId?: number
    dbCredentials: DbCredentialsCreateNestedOneWithoutUsersInput
    role?: RoleCreateNestedOneWithoutUsersInput
    plan?: PlanCreateNestedOneWithoutUsersInput
    invitation?: UserInvitationCreateNestedOneWithoutUserInput
    announcementViews?: AnnouncementViewCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutRequestLogsInput = {
    id?: string
    user: string
    passwordHash: string
    status?: boolean
    dbCredentialsId: string
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    storeId?: number
    roleId?: string | null
    planId?: string | null
    invitation?: UserInvitationUncheckedCreateNestedOneWithoutUserInput
    announcementViews?: AnnouncementViewUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutRequestLogsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutRequestLogsInput, UserUncheckedCreateWithoutRequestLogsInput>
  }

  export type UserUpsertWithoutRequestLogsInput = {
    update: XOR<UserUpdateWithoutRequestLogsInput, UserUncheckedUpdateWithoutRequestLogsInput>
    create: XOR<UserCreateWithoutRequestLogsInput, UserUncheckedCreateWithoutRequestLogsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutRequestLogsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutRequestLogsInput, UserUncheckedUpdateWithoutRequestLogsInput>
  }

  export type UserUpdateWithoutRequestLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    user?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    status?: BoolFieldUpdateOperationsInput | boolean
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storeId?: IntFieldUpdateOperationsInput | number
    dbCredentials?: DbCredentialsUpdateOneRequiredWithoutUsersNestedInput
    role?: RoleUpdateOneWithoutUsersNestedInput
    plan?: PlanUpdateOneWithoutUsersNestedInput
    invitation?: UserInvitationUpdateOneWithoutUserNestedInput
    announcementViews?: AnnouncementViewUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutRequestLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    user?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    status?: BoolFieldUpdateOperationsInput | boolean
    dbCredentialsId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storeId?: IntFieldUpdateOperationsInput | number
    roleId?: NullableStringFieldUpdateOperationsInput | string | null
    planId?: NullableStringFieldUpdateOperationsInput | string | null
    invitation?: UserInvitationUncheckedUpdateOneWithoutUserNestedInput
    announcementViews?: AnnouncementViewUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutInvitationInput = {
    id?: string
    user: string
    passwordHash: string
    status?: boolean
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    storeId?: number
    dbCredentials: DbCredentialsCreateNestedOneWithoutUsersInput
    role?: RoleCreateNestedOneWithoutUsersInput
    plan?: PlanCreateNestedOneWithoutUsersInput
    requestLogs?: RequestLogCreateNestedManyWithoutUserInput
    announcementViews?: AnnouncementViewCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutInvitationInput = {
    id?: string
    user: string
    passwordHash: string
    status?: boolean
    dbCredentialsId: string
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    storeId?: number
    roleId?: string | null
    planId?: string | null
    requestLogs?: RequestLogUncheckedCreateNestedManyWithoutUserInput
    announcementViews?: AnnouncementViewUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutInvitationInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutInvitationInput, UserUncheckedCreateWithoutInvitationInput>
  }

  export type UserUpsertWithoutInvitationInput = {
    update: XOR<UserUpdateWithoutInvitationInput, UserUncheckedUpdateWithoutInvitationInput>
    create: XOR<UserCreateWithoutInvitationInput, UserUncheckedCreateWithoutInvitationInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutInvitationInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutInvitationInput, UserUncheckedUpdateWithoutInvitationInput>
  }

  export type UserUpdateWithoutInvitationInput = {
    id?: StringFieldUpdateOperationsInput | string
    user?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    status?: BoolFieldUpdateOperationsInput | boolean
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storeId?: IntFieldUpdateOperationsInput | number
    dbCredentials?: DbCredentialsUpdateOneRequiredWithoutUsersNestedInput
    role?: RoleUpdateOneWithoutUsersNestedInput
    plan?: PlanUpdateOneWithoutUsersNestedInput
    requestLogs?: RequestLogUpdateManyWithoutUserNestedInput
    announcementViews?: AnnouncementViewUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutInvitationInput = {
    id?: StringFieldUpdateOperationsInput | string
    user?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    status?: BoolFieldUpdateOperationsInput | boolean
    dbCredentialsId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storeId?: IntFieldUpdateOperationsInput | number
    roleId?: NullableStringFieldUpdateOperationsInput | string | null
    planId?: NullableStringFieldUpdateOperationsInput | string | null
    requestLogs?: RequestLogUncheckedUpdateManyWithoutUserNestedInput
    announcementViews?: AnnouncementViewUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutDbCredentialsInput = {
    id?: string
    user: string
    passwordHash: string
    status?: boolean
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    storeId?: number
    role?: RoleCreateNestedOneWithoutUsersInput
    plan?: PlanCreateNestedOneWithoutUsersInput
    invitation?: UserInvitationCreateNestedOneWithoutUserInput
    requestLogs?: RequestLogCreateNestedManyWithoutUserInput
    announcementViews?: AnnouncementViewCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutDbCredentialsInput = {
    id?: string
    user: string
    passwordHash: string
    status?: boolean
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    storeId?: number
    roleId?: string | null
    planId?: string | null
    invitation?: UserInvitationUncheckedCreateNestedOneWithoutUserInput
    requestLogs?: RequestLogUncheckedCreateNestedManyWithoutUserInput
    announcementViews?: AnnouncementViewUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutDbCredentialsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutDbCredentialsInput, UserUncheckedCreateWithoutDbCredentialsInput>
  }

  export type UserCreateManyDbCredentialsInputEnvelope = {
    data: UserCreateManyDbCredentialsInput | UserCreateManyDbCredentialsInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithWhereUniqueWithoutDbCredentialsInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutDbCredentialsInput, UserUncheckedUpdateWithoutDbCredentialsInput>
    create: XOR<UserCreateWithoutDbCredentialsInput, UserUncheckedCreateWithoutDbCredentialsInput>
  }

  export type UserUpdateWithWhereUniqueWithoutDbCredentialsInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutDbCredentialsInput, UserUncheckedUpdateWithoutDbCredentialsInput>
  }

  export type UserUpdateManyWithWhereWithoutDbCredentialsInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutDbCredentialsInput>
  }

  export type RolePermissionCreateWithoutRoleInput = {
    permission: PermissionCreateNestedOneWithoutRolePermissionsInput
  }

  export type RolePermissionUncheckedCreateWithoutRoleInput = {
    permissionId: string
  }

  export type RolePermissionCreateOrConnectWithoutRoleInput = {
    where: RolePermissionWhereUniqueInput
    create: XOR<RolePermissionCreateWithoutRoleInput, RolePermissionUncheckedCreateWithoutRoleInput>
  }

  export type RolePermissionCreateManyRoleInputEnvelope = {
    data: RolePermissionCreateManyRoleInput | RolePermissionCreateManyRoleInput[]
    skipDuplicates?: boolean
  }

  export type UserCreateWithoutRoleInput = {
    id?: string
    user: string
    passwordHash: string
    status?: boolean
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    storeId?: number
    dbCredentials: DbCredentialsCreateNestedOneWithoutUsersInput
    plan?: PlanCreateNestedOneWithoutUsersInput
    invitation?: UserInvitationCreateNestedOneWithoutUserInput
    requestLogs?: RequestLogCreateNestedManyWithoutUserInput
    announcementViews?: AnnouncementViewCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutRoleInput = {
    id?: string
    user: string
    passwordHash: string
    status?: boolean
    dbCredentialsId: string
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    storeId?: number
    planId?: string | null
    invitation?: UserInvitationUncheckedCreateNestedOneWithoutUserInput
    requestLogs?: RequestLogUncheckedCreateNestedManyWithoutUserInput
    announcementViews?: AnnouncementViewUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutRoleInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutRoleInput, UserUncheckedCreateWithoutRoleInput>
  }

  export type UserCreateManyRoleInputEnvelope = {
    data: UserCreateManyRoleInput | UserCreateManyRoleInput[]
    skipDuplicates?: boolean
  }

  export type RolePermissionUpsertWithWhereUniqueWithoutRoleInput = {
    where: RolePermissionWhereUniqueInput
    update: XOR<RolePermissionUpdateWithoutRoleInput, RolePermissionUncheckedUpdateWithoutRoleInput>
    create: XOR<RolePermissionCreateWithoutRoleInput, RolePermissionUncheckedCreateWithoutRoleInput>
  }

  export type RolePermissionUpdateWithWhereUniqueWithoutRoleInput = {
    where: RolePermissionWhereUniqueInput
    data: XOR<RolePermissionUpdateWithoutRoleInput, RolePermissionUncheckedUpdateWithoutRoleInput>
  }

  export type RolePermissionUpdateManyWithWhereWithoutRoleInput = {
    where: RolePermissionScalarWhereInput
    data: XOR<RolePermissionUpdateManyMutationInput, RolePermissionUncheckedUpdateManyWithoutRoleInput>
  }

  export type RolePermissionScalarWhereInput = {
    AND?: RolePermissionScalarWhereInput | RolePermissionScalarWhereInput[]
    OR?: RolePermissionScalarWhereInput[]
    NOT?: RolePermissionScalarWhereInput | RolePermissionScalarWhereInput[]
    roleId?: StringFilter<"RolePermission"> | string
    permissionId?: StringFilter<"RolePermission"> | string
  }

  export type UserUpsertWithWhereUniqueWithoutRoleInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutRoleInput, UserUncheckedUpdateWithoutRoleInput>
    create: XOR<UserCreateWithoutRoleInput, UserUncheckedCreateWithoutRoleInput>
  }

  export type UserUpdateWithWhereUniqueWithoutRoleInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutRoleInput, UserUncheckedUpdateWithoutRoleInput>
  }

  export type UserUpdateManyWithWhereWithoutRoleInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutRoleInput>
  }

  export type RolePermissionCreateWithoutPermissionInput = {
    role: RoleCreateNestedOneWithoutRolePermissionsInput
  }

  export type RolePermissionUncheckedCreateWithoutPermissionInput = {
    roleId: string
  }

  export type RolePermissionCreateOrConnectWithoutPermissionInput = {
    where: RolePermissionWhereUniqueInput
    create: XOR<RolePermissionCreateWithoutPermissionInput, RolePermissionUncheckedCreateWithoutPermissionInput>
  }

  export type RolePermissionCreateManyPermissionInputEnvelope = {
    data: RolePermissionCreateManyPermissionInput | RolePermissionCreateManyPermissionInput[]
    skipDuplicates?: boolean
  }

  export type RolePermissionUpsertWithWhereUniqueWithoutPermissionInput = {
    where: RolePermissionWhereUniqueInput
    update: XOR<RolePermissionUpdateWithoutPermissionInput, RolePermissionUncheckedUpdateWithoutPermissionInput>
    create: XOR<RolePermissionCreateWithoutPermissionInput, RolePermissionUncheckedCreateWithoutPermissionInput>
  }

  export type RolePermissionUpdateWithWhereUniqueWithoutPermissionInput = {
    where: RolePermissionWhereUniqueInput
    data: XOR<RolePermissionUpdateWithoutPermissionInput, RolePermissionUncheckedUpdateWithoutPermissionInput>
  }

  export type RolePermissionUpdateManyWithWhereWithoutPermissionInput = {
    where: RolePermissionScalarWhereInput
    data: XOR<RolePermissionUpdateManyMutationInput, RolePermissionUncheckedUpdateManyWithoutPermissionInput>
  }

  export type PermissionCreateWithoutRolePermissionsInput = {
    id?: string
    key: string
    name: string
    description?: string | null
  }

  export type PermissionUncheckedCreateWithoutRolePermissionsInput = {
    id?: string
    key: string
    name: string
    description?: string | null
  }

  export type PermissionCreateOrConnectWithoutRolePermissionsInput = {
    where: PermissionWhereUniqueInput
    create: XOR<PermissionCreateWithoutRolePermissionsInput, PermissionUncheckedCreateWithoutRolePermissionsInput>
  }

  export type RoleCreateWithoutRolePermissionsInput = {
    id?: string
    name: string
    description?: string | null
    users?: UserCreateNestedManyWithoutRoleInput
  }

  export type RoleUncheckedCreateWithoutRolePermissionsInput = {
    id?: string
    name: string
    description?: string | null
    users?: UserUncheckedCreateNestedManyWithoutRoleInput
  }

  export type RoleCreateOrConnectWithoutRolePermissionsInput = {
    where: RoleWhereUniqueInput
    create: XOR<RoleCreateWithoutRolePermissionsInput, RoleUncheckedCreateWithoutRolePermissionsInput>
  }

  export type PermissionUpsertWithoutRolePermissionsInput = {
    update: XOR<PermissionUpdateWithoutRolePermissionsInput, PermissionUncheckedUpdateWithoutRolePermissionsInput>
    create: XOR<PermissionCreateWithoutRolePermissionsInput, PermissionUncheckedCreateWithoutRolePermissionsInput>
    where?: PermissionWhereInput
  }

  export type PermissionUpdateToOneWithWhereWithoutRolePermissionsInput = {
    where?: PermissionWhereInput
    data: XOR<PermissionUpdateWithoutRolePermissionsInput, PermissionUncheckedUpdateWithoutRolePermissionsInput>
  }

  export type PermissionUpdateWithoutRolePermissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PermissionUncheckedUpdateWithoutRolePermissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RoleUpsertWithoutRolePermissionsInput = {
    update: XOR<RoleUpdateWithoutRolePermissionsInput, RoleUncheckedUpdateWithoutRolePermissionsInput>
    create: XOR<RoleCreateWithoutRolePermissionsInput, RoleUncheckedCreateWithoutRolePermissionsInput>
    where?: RoleWhereInput
  }

  export type RoleUpdateToOneWithWhereWithoutRolePermissionsInput = {
    where?: RoleWhereInput
    data: XOR<RoleUpdateWithoutRolePermissionsInput, RoleUncheckedUpdateWithoutRolePermissionsInput>
  }

  export type RoleUpdateWithoutRolePermissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    users?: UserUpdateManyWithoutRoleNestedInput
  }

  export type RoleUncheckedUpdateWithoutRolePermissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    users?: UserUncheckedUpdateManyWithoutRoleNestedInput
  }

  export type AnnouncementViewCreateWithoutAnnouncementInput = {
    id?: string
    viewedAt?: Date | string
    user: UserCreateNestedOneWithoutAnnouncementViewsInput
  }

  export type AnnouncementViewUncheckedCreateWithoutAnnouncementInput = {
    id?: string
    userId: string
    viewedAt?: Date | string
  }

  export type AnnouncementViewCreateOrConnectWithoutAnnouncementInput = {
    where: AnnouncementViewWhereUniqueInput
    create: XOR<AnnouncementViewCreateWithoutAnnouncementInput, AnnouncementViewUncheckedCreateWithoutAnnouncementInput>
  }

  export type AnnouncementViewCreateManyAnnouncementInputEnvelope = {
    data: AnnouncementViewCreateManyAnnouncementInput | AnnouncementViewCreateManyAnnouncementInput[]
    skipDuplicates?: boolean
  }

  export type NewsletterCreateWithoutAnnouncementsInput = {
    subject: string
    initialMessage?: string | null
    finalMessage?: string | null
    sentAt?: Date | string
  }

  export type NewsletterUncheckedCreateWithoutAnnouncementsInput = {
    id?: number
    subject: string
    initialMessage?: string | null
    finalMessage?: string | null
    sentAt?: Date | string
  }

  export type NewsletterCreateOrConnectWithoutAnnouncementsInput = {
    where: NewsletterWhereUniqueInput
    create: XOR<NewsletterCreateWithoutAnnouncementsInput, NewsletterUncheckedCreateWithoutAnnouncementsInput>
  }

  export type AnnouncementViewUpsertWithWhereUniqueWithoutAnnouncementInput = {
    where: AnnouncementViewWhereUniqueInput
    update: XOR<AnnouncementViewUpdateWithoutAnnouncementInput, AnnouncementViewUncheckedUpdateWithoutAnnouncementInput>
    create: XOR<AnnouncementViewCreateWithoutAnnouncementInput, AnnouncementViewUncheckedCreateWithoutAnnouncementInput>
  }

  export type AnnouncementViewUpdateWithWhereUniqueWithoutAnnouncementInput = {
    where: AnnouncementViewWhereUniqueInput
    data: XOR<AnnouncementViewUpdateWithoutAnnouncementInput, AnnouncementViewUncheckedUpdateWithoutAnnouncementInput>
  }

  export type AnnouncementViewUpdateManyWithWhereWithoutAnnouncementInput = {
    where: AnnouncementViewScalarWhereInput
    data: XOR<AnnouncementViewUpdateManyMutationInput, AnnouncementViewUncheckedUpdateManyWithoutAnnouncementInput>
  }

  export type NewsletterUpsertWithoutAnnouncementsInput = {
    update: XOR<NewsletterUpdateWithoutAnnouncementsInput, NewsletterUncheckedUpdateWithoutAnnouncementsInput>
    create: XOR<NewsletterCreateWithoutAnnouncementsInput, NewsletterUncheckedCreateWithoutAnnouncementsInput>
    where?: NewsletterWhereInput
  }

  export type NewsletterUpdateToOneWithWhereWithoutAnnouncementsInput = {
    where?: NewsletterWhereInput
    data: XOR<NewsletterUpdateWithoutAnnouncementsInput, NewsletterUncheckedUpdateWithoutAnnouncementsInput>
  }

  export type NewsletterUpdateWithoutAnnouncementsInput = {
    subject?: StringFieldUpdateOperationsInput | string
    initialMessage?: NullableStringFieldUpdateOperationsInput | string | null
    finalMessage?: NullableStringFieldUpdateOperationsInput | string | null
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsletterUncheckedUpdateWithoutAnnouncementsInput = {
    id?: IntFieldUpdateOperationsInput | number
    subject?: StringFieldUpdateOperationsInput | string
    initialMessage?: NullableStringFieldUpdateOperationsInput | string | null
    finalMessage?: NullableStringFieldUpdateOperationsInput | string | null
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnnouncementCreateWithoutNewsletterInput = {
    id?: string
    type?: $Enums.AnnouncementType
    text: string
    ctaText?: string | null
    ctaLink?: string | null
    startDate?: Date | string | null
    endDate?: Date | string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    views?: AnnouncementViewCreateNestedManyWithoutAnnouncementInput
  }

  export type AnnouncementUncheckedCreateWithoutNewsletterInput = {
    id?: string
    type?: $Enums.AnnouncementType
    text: string
    ctaText?: string | null
    ctaLink?: string | null
    startDate?: Date | string | null
    endDate?: Date | string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    views?: AnnouncementViewUncheckedCreateNestedManyWithoutAnnouncementInput
  }

  export type AnnouncementCreateOrConnectWithoutNewsletterInput = {
    where: AnnouncementWhereUniqueInput
    create: XOR<AnnouncementCreateWithoutNewsletterInput, AnnouncementUncheckedCreateWithoutNewsletterInput>
  }

  export type AnnouncementCreateManyNewsletterInputEnvelope = {
    data: AnnouncementCreateManyNewsletterInput | AnnouncementCreateManyNewsletterInput[]
    skipDuplicates?: boolean
  }

  export type AnnouncementUpsertWithWhereUniqueWithoutNewsletterInput = {
    where: AnnouncementWhereUniqueInput
    update: XOR<AnnouncementUpdateWithoutNewsletterInput, AnnouncementUncheckedUpdateWithoutNewsletterInput>
    create: XOR<AnnouncementCreateWithoutNewsletterInput, AnnouncementUncheckedCreateWithoutNewsletterInput>
  }

  export type AnnouncementUpdateWithWhereUniqueWithoutNewsletterInput = {
    where: AnnouncementWhereUniqueInput
    data: XOR<AnnouncementUpdateWithoutNewsletterInput, AnnouncementUncheckedUpdateWithoutNewsletterInput>
  }

  export type AnnouncementUpdateManyWithWhereWithoutNewsletterInput = {
    where: AnnouncementScalarWhereInput
    data: XOR<AnnouncementUpdateManyMutationInput, AnnouncementUncheckedUpdateManyWithoutNewsletterInput>
  }

  export type AnnouncementScalarWhereInput = {
    AND?: AnnouncementScalarWhereInput | AnnouncementScalarWhereInput[]
    OR?: AnnouncementScalarWhereInput[]
    NOT?: AnnouncementScalarWhereInput | AnnouncementScalarWhereInput[]
    id?: StringFilter<"Announcement"> | string
    type?: EnumAnnouncementTypeFilter<"Announcement"> | $Enums.AnnouncementType
    text?: StringFilter<"Announcement"> | string
    ctaText?: StringNullableFilter<"Announcement"> | string | null
    ctaLink?: StringNullableFilter<"Announcement"> | string | null
    startDate?: DateTimeNullableFilter<"Announcement"> | Date | string | null
    endDate?: DateTimeNullableFilter<"Announcement"> | Date | string | null
    active?: BoolFilter<"Announcement"> | boolean
    newsletterId?: IntNullableFilter<"Announcement"> | number | null
    createdAt?: DateTimeFilter<"Announcement"> | Date | string
    updatedAt?: DateTimeFilter<"Announcement"> | Date | string
  }

  export type AnnouncementCreateWithoutViewsInput = {
    id?: string
    type?: $Enums.AnnouncementType
    text: string
    ctaText?: string | null
    ctaLink?: string | null
    startDate?: Date | string | null
    endDate?: Date | string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    newsletter?: NewsletterCreateNestedOneWithoutAnnouncementsInput
  }

  export type AnnouncementUncheckedCreateWithoutViewsInput = {
    id?: string
    type?: $Enums.AnnouncementType
    text: string
    ctaText?: string | null
    ctaLink?: string | null
    startDate?: Date | string | null
    endDate?: Date | string | null
    active?: boolean
    newsletterId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AnnouncementCreateOrConnectWithoutViewsInput = {
    where: AnnouncementWhereUniqueInput
    create: XOR<AnnouncementCreateWithoutViewsInput, AnnouncementUncheckedCreateWithoutViewsInput>
  }

  export type UserCreateWithoutAnnouncementViewsInput = {
    id?: string
    user: string
    passwordHash: string
    status?: boolean
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    storeId?: number
    dbCredentials: DbCredentialsCreateNestedOneWithoutUsersInput
    role?: RoleCreateNestedOneWithoutUsersInput
    plan?: PlanCreateNestedOneWithoutUsersInput
    invitation?: UserInvitationCreateNestedOneWithoutUserInput
    requestLogs?: RequestLogCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAnnouncementViewsInput = {
    id?: string
    user: string
    passwordHash: string
    status?: boolean
    dbCredentialsId: string
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    storeId?: number
    roleId?: string | null
    planId?: string | null
    invitation?: UserInvitationUncheckedCreateNestedOneWithoutUserInput
    requestLogs?: RequestLogUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAnnouncementViewsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAnnouncementViewsInput, UserUncheckedCreateWithoutAnnouncementViewsInput>
  }

  export type AnnouncementUpsertWithoutViewsInput = {
    update: XOR<AnnouncementUpdateWithoutViewsInput, AnnouncementUncheckedUpdateWithoutViewsInput>
    create: XOR<AnnouncementCreateWithoutViewsInput, AnnouncementUncheckedCreateWithoutViewsInput>
    where?: AnnouncementWhereInput
  }

  export type AnnouncementUpdateToOneWithWhereWithoutViewsInput = {
    where?: AnnouncementWhereInput
    data: XOR<AnnouncementUpdateWithoutViewsInput, AnnouncementUncheckedUpdateWithoutViewsInput>
  }

  export type AnnouncementUpdateWithoutViewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumAnnouncementTypeFieldUpdateOperationsInput | $Enums.AnnouncementType
    text?: StringFieldUpdateOperationsInput | string
    ctaText?: NullableStringFieldUpdateOperationsInput | string | null
    ctaLink?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    newsletter?: NewsletterUpdateOneWithoutAnnouncementsNestedInput
  }

  export type AnnouncementUncheckedUpdateWithoutViewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumAnnouncementTypeFieldUpdateOperationsInput | $Enums.AnnouncementType
    text?: StringFieldUpdateOperationsInput | string
    ctaText?: NullableStringFieldUpdateOperationsInput | string | null
    ctaLink?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    newsletterId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUpsertWithoutAnnouncementViewsInput = {
    update: XOR<UserUpdateWithoutAnnouncementViewsInput, UserUncheckedUpdateWithoutAnnouncementViewsInput>
    create: XOR<UserCreateWithoutAnnouncementViewsInput, UserUncheckedCreateWithoutAnnouncementViewsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAnnouncementViewsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAnnouncementViewsInput, UserUncheckedUpdateWithoutAnnouncementViewsInput>
  }

  export type UserUpdateWithoutAnnouncementViewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    user?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    status?: BoolFieldUpdateOperationsInput | boolean
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storeId?: IntFieldUpdateOperationsInput | number
    dbCredentials?: DbCredentialsUpdateOneRequiredWithoutUsersNestedInput
    role?: RoleUpdateOneWithoutUsersNestedInput
    plan?: PlanUpdateOneWithoutUsersNestedInput
    invitation?: UserInvitationUpdateOneWithoutUserNestedInput
    requestLogs?: RequestLogUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAnnouncementViewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    user?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    status?: BoolFieldUpdateOperationsInput | boolean
    dbCredentialsId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storeId?: IntFieldUpdateOperationsInput | number
    roleId?: NullableStringFieldUpdateOperationsInput | string | null
    planId?: NullableStringFieldUpdateOperationsInput | string | null
    invitation?: UserInvitationUncheckedUpdateOneWithoutUserNestedInput
    requestLogs?: RequestLogUncheckedUpdateManyWithoutUserNestedInput
  }

  export type RequestLogCreateManyUserInput = {
    id?: string
    method: string
    path: string
    status: number
    ip?: string | null
    durationMs?: number | null
    createdAt?: Date | string
  }

  export type AnnouncementViewCreateManyUserInput = {
    id?: string
    announcementId: string
    viewedAt?: Date | string
  }

  export type RequestLogUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    method?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    durationMs?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RequestLogUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    method?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    durationMs?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RequestLogUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    method?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    durationMs?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnnouncementViewUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    viewedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    announcement?: AnnouncementUpdateOneRequiredWithoutViewsNestedInput
  }

  export type AnnouncementViewUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    announcementId?: StringFieldUpdateOperationsInput | string
    viewedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnnouncementViewUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    announcementId?: StringFieldUpdateOperationsInput | string
    viewedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateManyPlanInput = {
    id?: string
    user: string
    passwordHash: string
    status?: boolean
    dbCredentialsId: string
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    storeId?: number
    roleId?: string | null
  }

  export type UserUpdateWithoutPlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    user?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    status?: BoolFieldUpdateOperationsInput | boolean
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storeId?: IntFieldUpdateOperationsInput | number
    dbCredentials?: DbCredentialsUpdateOneRequiredWithoutUsersNestedInput
    role?: RoleUpdateOneWithoutUsersNestedInput
    invitation?: UserInvitationUpdateOneWithoutUserNestedInput
    requestLogs?: RequestLogUpdateManyWithoutUserNestedInput
    announcementViews?: AnnouncementViewUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    user?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    status?: BoolFieldUpdateOperationsInput | boolean
    dbCredentialsId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storeId?: IntFieldUpdateOperationsInput | number
    roleId?: NullableStringFieldUpdateOperationsInput | string | null
    invitation?: UserInvitationUncheckedUpdateOneWithoutUserNestedInput
    requestLogs?: RequestLogUncheckedUpdateManyWithoutUserNestedInput
    announcementViews?: AnnouncementViewUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateManyWithoutPlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    user?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    status?: BoolFieldUpdateOperationsInput | boolean
    dbCredentialsId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storeId?: IntFieldUpdateOperationsInput | number
    roleId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserCreateManyDbCredentialsInput = {
    id?: string
    user: string
    passwordHash: string
    status?: boolean
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    storeId?: number
    roleId?: string | null
    planId?: string | null
  }

  export type UserUpdateWithoutDbCredentialsInput = {
    id?: StringFieldUpdateOperationsInput | string
    user?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    status?: BoolFieldUpdateOperationsInput | boolean
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storeId?: IntFieldUpdateOperationsInput | number
    role?: RoleUpdateOneWithoutUsersNestedInput
    plan?: PlanUpdateOneWithoutUsersNestedInput
    invitation?: UserInvitationUpdateOneWithoutUserNestedInput
    requestLogs?: RequestLogUpdateManyWithoutUserNestedInput
    announcementViews?: AnnouncementViewUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutDbCredentialsInput = {
    id?: StringFieldUpdateOperationsInput | string
    user?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    status?: BoolFieldUpdateOperationsInput | boolean
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storeId?: IntFieldUpdateOperationsInput | number
    roleId?: NullableStringFieldUpdateOperationsInput | string | null
    planId?: NullableStringFieldUpdateOperationsInput | string | null
    invitation?: UserInvitationUncheckedUpdateOneWithoutUserNestedInput
    requestLogs?: RequestLogUncheckedUpdateManyWithoutUserNestedInput
    announcementViews?: AnnouncementViewUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateManyWithoutDbCredentialsInput = {
    id?: StringFieldUpdateOperationsInput | string
    user?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    status?: BoolFieldUpdateOperationsInput | boolean
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storeId?: IntFieldUpdateOperationsInput | number
    roleId?: NullableStringFieldUpdateOperationsInput | string | null
    planId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RolePermissionCreateManyRoleInput = {
    permissionId: string
  }

  export type UserCreateManyRoleInput = {
    id?: string
    user: string
    passwordHash: string
    status?: boolean
    dbCredentialsId: string
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    storeId?: number
    planId?: string | null
  }

  export type RolePermissionUpdateWithoutRoleInput = {
    permission?: PermissionUpdateOneRequiredWithoutRolePermissionsNestedInput
  }

  export type RolePermissionUncheckedUpdateWithoutRoleInput = {
    permissionId?: StringFieldUpdateOperationsInput | string
  }

  export type RolePermissionUncheckedUpdateManyWithoutRoleInput = {
    permissionId?: StringFieldUpdateOperationsInput | string
  }

  export type UserUpdateWithoutRoleInput = {
    id?: StringFieldUpdateOperationsInput | string
    user?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    status?: BoolFieldUpdateOperationsInput | boolean
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storeId?: IntFieldUpdateOperationsInput | number
    dbCredentials?: DbCredentialsUpdateOneRequiredWithoutUsersNestedInput
    plan?: PlanUpdateOneWithoutUsersNestedInput
    invitation?: UserInvitationUpdateOneWithoutUserNestedInput
    requestLogs?: RequestLogUpdateManyWithoutUserNestedInput
    announcementViews?: AnnouncementViewUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutRoleInput = {
    id?: StringFieldUpdateOperationsInput | string
    user?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    status?: BoolFieldUpdateOperationsInput | boolean
    dbCredentialsId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storeId?: IntFieldUpdateOperationsInput | number
    planId?: NullableStringFieldUpdateOperationsInput | string | null
    invitation?: UserInvitationUncheckedUpdateOneWithoutUserNestedInput
    requestLogs?: RequestLogUncheckedUpdateManyWithoutUserNestedInput
    announcementViews?: AnnouncementViewUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateManyWithoutRoleInput = {
    id?: StringFieldUpdateOperationsInput | string
    user?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    status?: BoolFieldUpdateOperationsInput | boolean
    dbCredentialsId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storeId?: IntFieldUpdateOperationsInput | number
    planId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RolePermissionCreateManyPermissionInput = {
    roleId: string
  }

  export type RolePermissionUpdateWithoutPermissionInput = {
    role?: RoleUpdateOneRequiredWithoutRolePermissionsNestedInput
  }

  export type RolePermissionUncheckedUpdateWithoutPermissionInput = {
    roleId?: StringFieldUpdateOperationsInput | string
  }

  export type RolePermissionUncheckedUpdateManyWithoutPermissionInput = {
    roleId?: StringFieldUpdateOperationsInput | string
  }

  export type AnnouncementViewCreateManyAnnouncementInput = {
    id?: string
    userId: string
    viewedAt?: Date | string
  }

  export type AnnouncementViewUpdateWithoutAnnouncementInput = {
    id?: StringFieldUpdateOperationsInput | string
    viewedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAnnouncementViewsNestedInput
  }

  export type AnnouncementViewUncheckedUpdateWithoutAnnouncementInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    viewedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnnouncementViewUncheckedUpdateManyWithoutAnnouncementInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    viewedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnnouncementCreateManyNewsletterInput = {
    id?: string
    type?: $Enums.AnnouncementType
    text: string
    ctaText?: string | null
    ctaLink?: string | null
    startDate?: Date | string | null
    endDate?: Date | string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AnnouncementUpdateWithoutNewsletterInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumAnnouncementTypeFieldUpdateOperationsInput | $Enums.AnnouncementType
    text?: StringFieldUpdateOperationsInput | string
    ctaText?: NullableStringFieldUpdateOperationsInput | string | null
    ctaLink?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    views?: AnnouncementViewUpdateManyWithoutAnnouncementNestedInput
  }

  export type AnnouncementUncheckedUpdateWithoutNewsletterInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumAnnouncementTypeFieldUpdateOperationsInput | $Enums.AnnouncementType
    text?: StringFieldUpdateOperationsInput | string
    ctaText?: NullableStringFieldUpdateOperationsInput | string | null
    ctaLink?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    views?: AnnouncementViewUncheckedUpdateManyWithoutAnnouncementNestedInput
  }

  export type AnnouncementUncheckedUpdateManyWithoutNewsletterInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumAnnouncementTypeFieldUpdateOperationsInput | $Enums.AnnouncementType
    text?: StringFieldUpdateOperationsInput | string
    ctaText?: NullableStringFieldUpdateOperationsInput | string | null
    ctaLink?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}
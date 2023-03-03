require 'minitest/autorun'
require 'timeout'

CUSTOMERS_SUCCESS_WITH_SAME_AMOUT_OF_CUSTOMERS = 0

class CustomerSuccessBalancing
  def initialize(customer_success, customers, away_customer_success)
    @customer_success = customer_success
    @customers = customers
    @away_customer_success = away_customer_success
  end

  # Returns the ID of the customer success with most customers
  def execute
    customers_success_availables = get_avaliables_customers_success()

    customers_success_availables_sorted_by_score = sort_customers_success_by_score(customers_success_availables)

    customers_grouped_by_score = group_customers_by_score()

    customers_success_with_customers = add_customers_to_qualifieds_customers_success(customers_success_availables_sorted_by_score, customers_grouped_by_score)

    customers_success_sorted_by_home_many_customers_can_serve = sort_customers_success_by_wich_customers_can_serve(customers_success_with_customers)

    if customers_success_sorted_by_home_many_customers_can_serve[0][:customers].length != customers_success_sorted_by_home_many_customers_can_serve[1][:customers].length
      return customers_success_sorted_by_home_many_customers_can_serve[0][:id]
    end

    return CUSTOMERS_SUCCESS_WITH_SAME_AMOUT_OF_CUSTOMERS
  end


  def get_avaliables_customers_success
    return @customer_success.filter{|customer_success| !@away_customer_success.include?(customer_success[:id])}
  end

  def sort_customers_success_by_score(customers_success)
    return customers_success.sort_by{|customer_success| customer_success[:score]}
  end
  
  def group_customers_by_score()
    customers_grouped_by_score = {}
    @customers.each do |customer|
      group_of_customers = customers_grouped_by_score[customer[:score]]
      new_group_of_customers = group_of_customers.nil? ? [customer] : group_of_customers + [customer]
      customers_grouped_by_score[customer[:score]] = new_group_of_customers
    end
    customers_grouped_by_score.sort.to_h
  end

  def add_customers_to_qualifieds_customers_success(customers_success, customers_grouped_by_score)
    customers_groups_scores = customers_grouped_by_score.keys

    customers_success.map do |cs|
      cs_score = cs[:score]

      first_overscore = customers_groups_scores.find_index { |score| score.to_i > cs_score }

      customers_groups_scores_keys = customers_groups_scores.slice!(0, first_overscore || customers_groups_scores.length)

      cs[:customers] = customers_groups_scores_keys
                          .map { |score_key| customers_grouped_by_score[score_key] }
                          .flatten
    end

    return customers_success
  end

  def sort_customers_success_by_wich_customers_can_serve(customers_success)
    return customers_success.sort_by { |cs| cs[:customers].length }.reverse
  end
end

class CustomerSuccessBalancingTests < Minitest::Test
  def test_scenario_one
    balancer = CustomerSuccessBalancing.new(
      build_scores([60, 20, 95, 75]),
      build_scores([90, 20, 70, 40, 60, 10]),
      [2, 4]
    )
    assert_equal 1, balancer.execute
  end

  def test_scenario_two
    balancer = CustomerSuccessBalancing.new(
      build_scores([11, 21, 31, 3, 4, 5]),
      build_scores([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]),
      []
    )
    assert_equal 0, balancer.execute
  end

  def test_scenario_three
    balancer = CustomerSuccessBalancing.new(
      build_scores(Array(1..999)),
      build_scores(Array.new(10000, 998)),
      [999]
    )
    result = Timeout.timeout(1.0) { balancer.execute }
    assert_equal 998, result
  end

  def test_scenario_four
    balancer = CustomerSuccessBalancing.new(
      build_scores([1, 2, 3, 4, 5, 6]),
      build_scores([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]),
      []
    )
    assert_equal 0, balancer.execute
  end

  def test_scenario_five
    balancer = CustomerSuccessBalancing.new(
      build_scores([100, 2, 3, 6, 4, 5]),
      build_scores([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]),
      []
    )
    assert_equal 1, balancer.execute
  end

  def test_scenario_six
    balancer = CustomerSuccessBalancing.new(
      build_scores([100, 99, 88, 3, 4, 5]),
      build_scores([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]),
      [1, 3, 2]
    )
    assert_equal 0, balancer.execute
  end

  def test_scenario_seven
    balancer = CustomerSuccessBalancing.new(
      build_scores([100, 99, 88, 3, 4, 5]),
      build_scores([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]),
      [4, 5, 6]
    )
    assert_equal 3, balancer.execute
  end

  private

  def build_scores(scores)
    scores.map.with_index do |score, index|
      { id: index + 1, score: score }
    end
  end
end
